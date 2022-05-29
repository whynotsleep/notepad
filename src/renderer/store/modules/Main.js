import fetch from '../../utils/request'
import * as moment from 'moment'

const state = {
  cateList:  [], //分类列表
  articleList: [], // 文章列表
  currentCate: null, // 当前分类
  currentArticle: null, // 当前文章
  articleCache: {} // 文章缓存
}

const mutations = {
  // 覆盖
  SET(state, data) {
    if(!data) return
    for(const key in data) {
      if(state.hasOwnProperty(key)) {
        state[key] = data[key]
      }
    }
  },

  SET_ONE_OBJECT(state, {name, key, data}) {
    if(!state[name]) return
    state[name][key] = data
  },

  // 更新列表中的文章标题
  UPDATE_ARTICLE_TITLE(state, {article_id, title, update_date}) {
    const article = state.articleList.find(item => item.article_id === article_id)
    if(article) {
      article.title = title
      article.update_date = update_date
    }
  },

}

const actions = {
  // 获取分类列表
  async getCateList({ commit }) {
    try {
      const { code, data, msg } = await fetch("/category/getList", {});
      if (code === 0) {
        commit('SET', {
          cateList: data
        })
        return true
      } else {
        console.log(msg)
      }
    } catch (err) {
      console.error(err);
    }
    commit('SET', {
      cateList: []
    })
    return false
  },
  
  // 添加分类
  async addCate({ commit, state }, { label }) {
    try {
      const { code, data, msg } = await fetch("/category/add", {
        label
      })
      if (code === 0 && data.changes >= 1) {
        const cate = {
          label,
          cate_id: data.lastInsertRowid
        }
        commit('SET', {
          cateList: [cate, ...state.cateList]
        })
        return true
        // const res = await fetch("/category/get", {
        //   id: data.lastInsertRowid,
        // });
        // return res.data;
      } else {
        console.log(msg)
      }
    } catch (err) {
      console.error(err);
    }
    return false
  },

  // 删除分类
  async delCate({ commit, state }, { cate_id }) {
    try {
      const { code, data, msg } = await fetch("/category/del", {
        id: cate_id,
      })
      if (code === 0 && data.changes >= 1) {
        const cateList = [...state.cateList]
        const index = cateList.findIndex((item, key) => item.cate_id === cate_id)
        if( index !== -1) {
          cateList.splice(index, 1)
        }
        const newData = {
          cateList
        }
        if(state.currentCate && state.currentCate.cate_id === cate_id) {
          newData.currentCate = cateList[0]
        }
        commit('SET', newData)
        return true
      } else {
        console.log(msg)
      }
    } catch (err) {
      console.error(err);
    }
    return false
  },

  // 更新分类
  async updateCate({ commit, state }, { cate_id, label }) {
    try {
      const { code, data, msg } = await fetch("/category/update", {
        id: cate_id,
        label,
      })
      if (code === 0 && data.changes >= 1) {
        const cateList = [...state.cateList]
        const index = cateList.findIndex((item, key) => item.cate_id === cate_id)
        if( index !== -1) {
          cateList.splice(index, 1, {
            ...cateList[index],
            label
          })
        }
        commit('SET', {
          cateList
        })
        return true
      } else {
        console.log(msg)
      }
    } catch (err) {
      console.error(err);
    }
    return false
  },

  // 根据分类id获取文章列表
  async getArticleList({ commit, state }, { cate_id }) {
    try {
      const {code, data, msg} = await fetch('/article/getSimpleList', {
        cateId: cate_id
      })
      if(code === 0) {
        commit('SET', {
          articleList: data
        })
        return true
      } else {
        console.log(msg)
      }
    } catch (err) {
      console.error(err);
    }
    return false
  },

  // 获取文章详情
  async getArticleDetail({ commit, state }, { article_id }) {
    if(state.articleCache[article_id]) {
      return state.articleCache[article_id]
    }
    return fetch('/article/get', {
      article_id
    }).then(res => {
      if(res.code === 0 && res.data) {
        commit('SET_ONE_OBJECT', {
          name: 'articleCache',
          key: article_id,
          data: res.data
        })
        return res.data
      } else {
        return
      }            
    })
  },

  // 新增文章
  async addArticle({ commit, state, dispatch }, { cate_id, title, content }) {
    try {
      const {code, data, msg} = await fetch('/article/add', {
        title: title,
        cateId: cate_id,
        content: content
      })
      if(code === 0 && data.changes >= 1) {
        const newArticle = await dispatch('getArticleDetail', {article_id: data.lastInsertRowid})
        if(newArticle) {
          commit('SET', {
            articleList: [newArticle, ...state.articleList]
          })
        }
        return true
      } else {
        console.log(msg)
      }
    } catch (err) {
      console.error(err)
    }
    return false
  },

  // 更新文章
  async updateArticle({ commit, state }, params) {
    try {
      params.update_date = moment().format('YYYY-MM-DD hh:mm:ss')
      commit('SET_ONE_OBJECT', {
        name: 'articleCache',
        key: params.article_id,
        data: {
          ...state.articleCache[params.article_id],
          ...params
        }
      })
      commit('UPDATE_ARTICLE_TITLE', {
        article_id: params.article_id,
        title: params.title,
        update_date: params.update_date
      })

      const { code, data, msg } = await fetch("/article/update", params)
      if(code === 0) {
        return true
      } else {
        console.log(msg)
      }
    } catch (err) {
      console.error(err);
    }
    return false
  },

  // 删除文章
  async delArticle({ commit, state }, { article_id }) {
    try {
      const res = await fetch('/article/del', {
        article_id
      })
      if(res.code === 0 && res.data.changes > 0) {
        const articleList = [...state.articleList]
        const index = articleList.findIndex((item) => item.article_id === article_id)
        // 删除列表中的数据
        if(index !== -1) {
          articleList.splice(index, 1)
        }
        // 删除缓存
        if(state.articleCache[article_id]) {
          commit('SET_ONE_OBJECT', {
            name: 'articleCache',
            key: article_id,
            data: null
          })
        }
        const newData = {
          articleList
        }
        const { currentArticle } = state
        // 删除当前项后，默认选中第一项
        if(currentArticle && currentArticle.article_id === article_id) {
          newData.currentArticle = articleList[0]
        }
        commit('SET', newData)
        return true
      } else {
        console.log(msg)
      }  
    } catch (err) {
      console.error(err);
    }
    return false
  },
}

export default {
  state,
  mutations,
  actions
}
