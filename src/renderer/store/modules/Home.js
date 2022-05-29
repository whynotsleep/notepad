const state = {
    selectedCate: [], // 被点击过的分类id数组
    currentCate: null, // 当前分类
    currentArticle: null, // 当前文章
    allArticleList: [], // 所有文章列表
    loading: false
}

const getters = {
    // 缓存中的文章列表
    articleList(state) {
        const {currentCate, allArticleList} = state
        if(!currentCate ) return []
        return allArticleList.filter(item => currentCate.cate_id === item.cate_id)
    }
}

const mutations = {
    // 选中当前分类
    updateCurrentCate(state, data) {
        state.currentCate = data
    },

    // 选中当前文章列表
    updateArticleList(state, data) {        
        if(!data) return
        const {cateId, list} = data
        state.selectedCate.push(cateId)
        const articleIds = state.allArticleList.map(item => item.article_id)
        const temp = list.filter(item => !articleIds.includes(item.article_id))
        state.allArticleList = state.allArticleList.concat(temp)
    },

    // 移除分类
    removeSelectedCate(state, data) {
        if(!data) return
        const index = state.selectedCate.findIndex(cate => cate.cate_id === data)
        if(index !== -1) {
            state.selectedCate.splice(index, 1)
            const articles = state.allArticleList.filter(item => item.cate_id !== data)
            state.allArticleList = articles
        }
    },

    setArticleDetail(state, data) {
        if(!data) return
        const detail = state.allArticleList.find(item => item.article_id === data.article_id)
        if(detail) {
            detail.title = data.title
            detail.content = data.content
        }
    },

    // 选中当前文章
    updateCurrentArticle(state, data) {
        state.currentArticle = data
    },

    addArticleToStore(state, data) {
        if(!data) return
        state.allArticleList.unshift(data)
    },

    updateArticleTitle(state, data) {
        const index = state.allArticleList.findIndex(item => data.article_id === item.article_id)
        
        if(index !== -1) {
            state.allArticleList[index].title = data.title
        }  
    },
    //
    updateArticleContent(state, data) {
        const index = state.allArticleList.findIndex(item => data.article_id === item.article_id)
        
        if(index !== -1) {
            state.allArticleList[index].content = data.content
        }  
    },
    // 更新文章标题和内容
    updateArticleDetail(state, data) {
        const index = state.allArticleList.findIndex(item => data.article_id === item.article_id)
        
        if(index !== -1) {
            state.allArticleList[index].title = data.title
            state.allArticleList[index].content = data.content
        }
    },
    // 删除文章
    deleteArticle(state, articleId) {
        const index = state.allArticleList.findIndex(item => articleId === item.article_id)
        if(index !== -1) {
            state.allArticleList.splice(index, 1)
        }   
    },
    updateLoading(state, data) {
        state.loading = data
    }
}

const actions = {
    someAsyncTask({
        commit
    }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}