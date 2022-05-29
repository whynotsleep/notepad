<template>
  <div class="articles">
    <ContextMenu :menus="contextmenuList" @newArticle="newArticle" @delArticleOperate="delArticleOperate">
      <ul class="article-list">
        <li
          class="article-item"
          v-for="(item, index) in articleList"
          :key="item.article_id"
          :data-id="item.article_id"
          :title="item.label"
          :class="{active: activeId === item.article_id}"
          @click="selectItem(item.article_id)"    
        >
          <div class="article-item-info" :title="item.title">
            <div class="article-item-label">
              <span>{{index+1}}&nbsp;-&nbsp;{{ item.title }}</span>
            </div>
          </div>
          <div class="article-item-bottom">
            {{ item.update_date }}
          </div>
        </li>
      </ul>      
    </ContextMenu>
  </div>
</template>

<script>
import ContextMenu from '../ContextMenu/index'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  name: "Articles",

  components: {
    ContextMenu
  },

  data() {
    return {
      activeId: -1,
      searchContent: '',
      contextmenuList: [
        {
          label: '新建文章',
          eventName: 'newArticle',
          classname: 'articles'
        },
        {
          label: '新建文章',
          eventName: 'newArticle',
          classname: 'article-item'
        },
        {
          label: '删除',
          eventName: 'delArticleOperate',
          classname: 'article-item'
        }
      ]
    };
  },

  computed: {
    ...mapState({
      currentCate: state => state.Main.currentCate,
      articleList: state => state.Main.articleList,
      currentArticle: (state) => state.Main.currentArticle,
    }),
    ...mapGetters([])
  },

  watch: {
    currentCate: {
      immediate: true,
      handler() {
        this.init()
      }
    },
    currentArticle: {
      immediate: true,
      handler(val) {
        if(val && val.article_id !== this.activeId) {
          this.selectItem(val.article_id, true)
        }
      }   
    }
  },

  created() {

  },

  mounted() {},

  beforeDestroy() {

  },

  methods: {
    ...mapMutations(['SET']),
    ...mapActions(['getArticleList', 'getArticleDetail', 'addArticle', 'updateArticle', 'delArticle']),

    async init() {
      if ( !this.currentCate ) return
      const cateId = this.currentCate.cate_id
      await this.getArticleList({cate_id: cateId})
      const defaultArticle = localStorage.getItem('default-article')
      const article_id = +defaultArticle

      if(article_id && !isNaN(article_id)) {
        this.selectItem(article_id, true)
      }
    },

    bodyClick() {

    },

    async newArticle() {
      if (!this.currentCate) return
      const cateId = this.currentCate.cate_id
      await this.addArticle({
        cate_id: cateId, title: '', content: ''
      })
    },

    async delArticleOperate(e) {
      const selected = this.articleList.find(item => item.article_id.toString() === e.dataset.id)
      if(selected) {
        this.delArticle({
          article_id: selected.article_id
        })
      }
    },

    async selectItem(article_id, notUser) {
      if(this.activeId === article_id) return

      if(!notUser) {
        localStorage.setItem('default-article', article_id)
      }
      
      const data = await this.getArticleDetail({article_id})
      if(data) {
        this.activeId = article_id
        this.SET({
          currentArticle: data
        })
        this.$emit("select", data)
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .top-wrap {
    display: flex;
    justify-content: center;
    padding: 7px;
    border-bottom: 1px solid #eee;
    .top-btns {
      height: 28px;
      background-color: #fff;
      position: relative;
      border-radius: 14px;
      padding: 0 10px;
      border-radius: 14px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn-label {
        padding: 0 10px;
      }
      .add-btn,.remove-btn {
        display: block;
        width: 28px;
        height: 28px;
        box-sizing: border-box;
        border-radius: 14px;
        line-height: 28px;
        cursor: pointer;
        transition: all 0.2;
        color: #6c6c6c;
        text-align: center;
      }
    }
  }
.articles {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  // background-color: #ececec;
  background-color: #fff;
  transition: all .15s;
  // background: linear-gradient(to bottom, #5b5b5b, #2c2e32);
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding: 10px;
  /deep/ .el-input__inner {
    border-radius: 16px;
  }
  .article-add {
    margin-right: 15px;
  }
  .article-add-icon {
    display: none;
    flex-shrink: 0;
    margin-left: 10px;
  }
}
.article-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .article-item {
    width: 100%;
    padding: 10px 15px;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 1px solid #ececec;
    .article-item-del {
      display: none;
      &:hover {
        transition: all 0.1s;
        transform: scale(1.4);
      }
    }

    &:last-of-type {
      border-bottom: none;
    }

    &:hover {
      background-color: #fafafa;
      .article-item-del {
        display: block;
      }
    }

    &.active {
      background-color: #ececec;
    }

    .article-item-info {
      width: 100%;
      box-sizing: border-box;
    }

    .article-item-label {
      width: 100%;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .article-item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      font-size: 10px;
      line-height: 14px;
    }
    .article-item-line {
      position: absolute;
      left: 15px;
      right: 15px;
      bottom: 0;
      border-bottom: 1px solid #cecece;
    }
  }
}
</style>
