<template>
  <div class="articles" v-contextmenu:listContextmenu>
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
        @click="selectItem(item, index)"    
      >
        <div class="article-item-info">
          <div class="article-item-label">
            <span>{{index+1}}&nbsp;-&nbsp;{{ item.title }}</span>
          </div>
        </div>
        <div class="article-item-bottom">
          {{ item.update_date }}
          <i class="el-icon-close article-item-del" title="删除" @click.stop="del(item)"></i>
        </div>
        <!-- <div class="article-item-line" v-if="index < articleList.length - 1"></div> -->
      </li>
    </ul>
    <v-contextmenu ref="listContextmenu">
      <v-contextmenu-item @click="createNew">新建文章</v-contextmenu-item>
    </v-contextmenu>
    <v-contextmenu ref="itemContextmenu">
      <v-contextmenu-item>重命名</v-contextmenu-item>
      <v-contextmenu-item @click="delOld">删除</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: "Articles",

  components: {},

  // props: ['searchContent'],

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
    ...mapMutations(['updateCurrentArticle', 'updateArticleList', 'delAtIndexArticleList']),

    async init() {
      this.getList();
      const first = this.articleList[0]
      first && this.selectItem(first)
    },

    getList() {
      if ( !this.currentCate ) return
      try {
        const list = this.$db.article.getSimpleList({
          cateId: this.currentCate.cate_id,
          content: this.searchContent ||''
        });
        this.updateArticleList(list)
        console.log("文章列表", list);
      } catch (err) {
        console.error(err);
      }
    },

    // 新建文章
    createNew() {
      if (!this.currentCate) return
      try {
        const info = this.$db.article.add('新建文章', JSON.stringify([]), this.currentCate.cate_id)
        console.log(info);
        if (info.changes >= 1) {
          const data = this.$db.article.get(info.lastInsertRowid);
          if (data) {
            this.updateArticleList([...this.articleList, data])
          }
          console.log(data);
        }
      } catch (err) {
        console.error(err);
      }
    },

    delOld() {},

    // 删除文章
    del(item) {
      try {
        const info = this.$db.article.del(item.article_id);
        console.log(info);
        if (info.changes > 0) {
          if(this.activeId === item.article_id) {
            this.init()
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

    selectItem(item) {
      if(this.activeId === item.article_id) return
      
      this.activeId = item.article_id
      const data = this.$db.article.get(item.article_id)
      this.updateCurrentArticle(data)
      console.log('切换文章', data)
      this.$emit("select", data);
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
      max-height: 40px;
      line-height: 20px;
      font-size: 14px;
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
      margin-top: 5px;
      font-size: 12px;
      line-height: 20px;
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
