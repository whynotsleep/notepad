<template>
  <div class="articles">
    <div class="search">
      <el-input
        placeholder="请输入搜索内容"
        suffix-icon="el-icon-search"
        size="small"
        v-model="searchContent"
        @input="getList"
      >
      </el-input>
    </div>
    <ul class="article-list">
      <li
        class="article-item"
        v-for="(item, index) in articleList"
        :key="item.article_id"
        :title="item.label"
        :class="{active: activeId === item.article_id}"
        @contextmenu.stop
        @click="selectItem(item.article_id)"    
      >
        <div class="article-item-info">
          <div class="article-item-label">
            <span>{{index+1}}&nbsp;-&nbsp;{{ item.title }}</span>
          </div>
        </div>
        <div class="article-item-bottom">
          {{ item.update_date }}
          <!-- <i class="el-icon-close article-item-del" title="删除" @click.stop="del(item)"></i> -->
        </div>
        <!-- <div class="article-item-line" v-if="index < articleList.length - 1"></div> -->
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: "Articles",

  components: {},

  data() {
    return {
      activeId: -1,
      searchContent: ''
    };
  },

  computed: {
    ...mapState({
      currentCate: state => state.Home.currentCate,
      articleList: state => state.Home.articleList,
    })
  },

  watch: {
    currentCate: {
      immediate: true,
      handler() {
        this.init()
      }
    }
  },

  created() {

  },

  mounted() {},

  beforeDestroy() {

  },

  methods: {
    ...mapMutations(['updateCurrentArticle', 'updateArticleList', 'delAtIndexArticleList', 'updateLoading']),

    async init() {
      await this.getList();
      const defaultArticle = localStorage.getItem('default-article')
      const article_id = +defaultArticle

      if(article_id && !isNaN(article_id)) {
        this.selectItem(article_id, true)
      }
    },

    async getList() {
      if ( !this.currentCate ) return
      try {
        const list = await this.$db.article.getSimpleList({
          cateId: this.currentCate.cate_id,
          content: this.searchContent ||''
        });
        this.updateArticleList(list)
      } catch (err) {
        console.error(err);
      }
    },

    // 新建文章
    async createNew() {
      if (!this.currentCate) return
      try {
        const info = await this.$db.article.add('新建文章', [], this.currentCate.cate_id)
        if (info.changes >= 1) {
          const data = await this.$db.article.get(info.lastInsertRowid);
          if (data) {
            this.updateArticleList([...this.articleList, data])
          }
        }
      } catch (err) {
        console.error(err);
      }
    },

    delOld() {},

    // 删除文章
    async del(item) {
      try {
        const info = await this.$db.article.del(item.article_id);
        if (info.changes > 0) {
          if(this.activeId === item.article_id) {
            this.init(this.articleList[0].article_id)
          } else {
            this.delAtIndexArticleList(item.article_id)
          }
        }
      } catch (err) {
        console.error(err);
      }
    },

    delActivity() {
      if(this.activeId) {
        this.del({
          article_id: this.activeId
        })
      }
    },

    async selectItem(article_id, notUser) {
      if(this.activeId === article_id) return
      if(!notUser) {
        localStorage.setItem('default-article', article_id)
      }
      
      this.updateLoading(true)
      const data = await this.$db.article.get(article_id)
      if(data) {
        this.activeId = article_id
        this.updateCurrentArticle(data)
        this.$emit("select", data)
      }
      this.updateLoading(false)
    },
  },
};
</script>

<style scoped lang="scss">
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
  overflow-y: auto;
  .article-item {
    width: 100%;
    padding: 10px 15px;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;

    .article-item-del {
      display: none;
      &:hover {
        transition: all 0.1s;
        transform: scale(1.4);
      }
    }

    &+.article-item {
      border-top: 1px solid #ececec;
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
      // padding: 10px;
      box-sizing: border-box;
      // background-color: #fff;
      // border: 1px solid #1777fe;
    }

    .article-item-label {
      max-height: 36px;
      line-height: 18px;
      font-size: 12px;
      overflow: hidden;
      word-break: break-all;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
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
