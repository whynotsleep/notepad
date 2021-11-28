<template>
  <div class="home">
    <div class="home-btns">
      <div class="home-btns-wrap">
        <div class="browser">
          <span class="browser-btn browser-red" title="关闭" @click="windowEvent('close')"></span>
          <span class="browser-btn browser-yellow" title="最大化" @click="windowEvent('max')"></span>
          <span class="browser-btn browser-blue" title="最小化" @click="windowEvent('min')"></span>
        </div>
        <div class="module-btns home-btns-left">
          <span
            class="home-top-btn"
            :class="{ active: cateIsOpen }"
            :title="articleIsOpen ? '打开分类列表' : '关闭分类列表'"
            @click="toggleCateOpen"
          >
            <i v-if="cateIsOpen" class="el-icon-folder-opened"></i>
            <i v-else class="el-icon-folder"></i>
          </span>
          <span class="home-top-btn" title="新建分类" @click="addNewCate">
            <i class="el-icon-folder-add"></i>
          </span>
          <span class="home-top-btn" title="删除分类" @click="removeCate">
            <i class="el-icon-folder-remove"></i>
          </span>
        </div>
        <div class="module-btns home-btns-middle">
          <span
            class="home-top-btn"
            :class="{ active: articleIsOpen }"
            :title="articleIsOpen ? '打开文章列表' : '关闭文章列表'"
            @click="toggleArticleOpen"
          >
            <i v-if="articleIsOpen" class="el-icon-document-copy"></i>
            <i v-else class="el-icon-tickets"></i>
          </span>
          <span class="home-top-btn" title="新建文章" @click="addNewArticle">
            <i class="el-icon-document-add"></i>
          </span>
          <span class="home-top-btn" title="删除文章" @click="removeArticle">
            <i class="el-icon-document-remove"></i>
          </span>
          <!-- <el-input
            placeholder="请输入搜索内容"
            suffix-icon="el-icon-search"
            size="mini"
            v-model="searchContent"
            @change="searchChange"
          >
          </el-input> -->
        </div>
        <div class="home-btns-right">
          <Toolbar
            class="toolbar"
            :editorId="editorId"
            :defaultConfig="toolbarConfig"
          />
        </div>
      </div>
    </div>
    <div class="home-content">
      <Categorys
        ref="category"
        :style="cateStyle"
      ></Categorys>
      <Articles
        ref="article"
        :style="articleStyle"
        :searchContent="searchContent"
        @select="selectArticle"
      ></Articles>
      <!-- contenteditable="true" -->
      <div id="editor" class="editor">
        <RichEditor
          ref="richEditor"
          :default-content="defaultContent"
        ></RichEditor>
      </div>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import RichEditor from "../components/RichEditor";
import Categorys from "../components/Category";
import Articles from "../components/Article";
import { mapState } from "vuex";
import {topBarKeys} from '../config/editor'
import {
  Toolbar
} from "@wangeditor/editor-for-vue";
export default {
  name: "Home",

  components: {
    RichEditor,
    Categorys,
    Articles,
    Toolbar
  },

  data() {
    return {
      defaultContent: [],
      cateIsOpen: true,
      articleIsOpen: true,
      searchContent: '',
      editorId: "w-e-1",
      toolbarConfig: {
        toolbarKeys: topBarKeys
      }
    };
  },

  computed: {
    ...mapState({
      currentArticle: (state) => state.Home.currentArticle,
    }),
    cateStyle() {
      return {
        width: this.cateIsOpen ? '160px' : 0,
        overflow: this.cateIsOpen ? 'hidden' : 'auto'
      }
    },
    articleStyle() {
      return {
        width: this.articleIsOpen ? '200px' : 0,
        overflow: this.articleIsOpen ? 'hidden' : 'auto'
      }
    }
  },

  watch: {
    currentArticle: {
      immediate: true,
      handler(article) {
        if (article) {
          this.selectArticle(article);
        }
      },
    },
  },

  created() {
    // this.$db.category.add('测试1')
  },

  mounted() {},

  methods: {
    selectArticle(article) {
      // const data = this.$db.article.get(article.article_id);
      // const content = JSON.parse(article.content)
      // if (Array.isArray(content)) {
      //   this.defaultContent = content
      // } else {
      //   this.defaultContent = []
      // }
    },

    toggleCateOpen() {
      this.cateIsOpen = !this.cateIsOpen;
    },
    toggleArticleOpen() {
      this.articleIsOpen = !this.articleIsOpen;
    },
    // 新增分类
    addNewCate() {
      this.$refs.category && this.$refs.category.createNew();
    },
    // 移除分类
    removeCate() {
      this.$refs.category && this.$refs.category.delCate();
    },
    // 新增文章
    addNewArticle() {
      this.$refs.article && this.$refs.article.createNew();
    },
    // 移除文章
    removeArticle() {
      this.$refs.article && this.$refs.article.delActivity();
    },
    searchChange() {
      // this.$refs.article && this.$refs.article.getList();
    },

    windowEvent(type) {
      ipcRenderer.send('render-event', type)
    }

    // 定时保存
  },
};
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 48px;
  box-sizing: border-box;
  .home-btns {
    width: 100%;
    padding: 10px 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    flex-shrink: 0;
    background-color: #d6d6d6;
    -webkit-app-region: drag;
      // display: flex;
      // flex-wrap: nowrap;
      // justify-content: space-around;
    .home-btns-wrap {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
    }
    // overflow-x: auto;

    .browser {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin: 0 20px;
      .browser-btn {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        cursor: pointer;
        -webkit-app-region: no-drag;
        &+.browser-btn {
          margin-left: 5px;
        }
      }
      
      .browser-red {
        background-color: #fb4648;
      }
      .browser-yellow {
        background-color: #fbb323;
      }
      .browser-blue {
        background-color: #2cc232;
      }
    }

    .module-btns {
      display: flex;
      flex-shrink: 0;
      margin: 0 10px;
      -webkit-app-region: no-drag;
      span {
        display: block;
        height: 26px;
        padding: 0 10px;
        line-height: 26px;
        cursor: pointer;
        border-top: 1px solid #bbb;
        border-bottom: 1px solid #bbb;
        transition: all 0.2;
        color: #6c6c6c;
        background: #efefef;
        & + span {
          border-left: 1px solid #bbb;
        }

        &:first-of-type {
          border-left: 1px solid #bbb;
          border-radius: 6px 0 0 6px;
        }
        &:last-of-type {
          border-right: 1px solid #bbb;
          border-radius: 0 6px 6px 0;
        }

        &:hover {
          background-color: #fff;
          // border-color: transparent;
        }

        &.active {
          background-color: #6a6a6a;
          border-color: transparent;
          color: #fff;
        }
      }
    }
    .home-btns-left {
      // width: 200px;
      display: flex;
      justify-content: center;
    }
    .home-btns-middle {
      // width: 300px;
      display: flex;
      justify-content: center;
    }
    .home-btns-right {
      flex: 1;
      display: flex;
      justify-content: center;
    }
  }
  .home-content {
    width: 100%;
    flex: 1;
    display: flex;
    overflow: hidden;
    border-top: 1px solid #f1f1f1;
  }
}
.editor {
  flex: 1;
  height: 100%;
  overflow: hidden;
  border-left: 1px solid #ccc;
  background-color: #fff;
}
.toolbar {
  -webkit-app-region: no-drag;
  /deep/.w-e-bar {
    padding: 0;
    flex-wrap: nowrap;
    background-color: transparent;
    > .w-e-bar-item {
      &:first-of-type, &:first-of-type button {
        border-radius: 6px 0 0 6px;
      }
      &:last-of-type, &:last-of-type button {
        border-radius: 0 6px 6px 0;
      }
    }
    .w-e-bar-item {
      height: 28px;
      padding: 0;
      background: #efefef;
      -webkit-app-region: no-drag;
      // border-right: 1px solid #bbb;

      button {
        width: 100%;
        height: 28px;
        padding: 0 8px;
        line-height: 28px;
        align-items: center;
        color: #6c6c6c;
        user-select: none;
        &:hover {
          background-color: #fff;
          color: #333;
        }
      }
      .w-e-bar-item-menus-container {
        margin-top: 26px;
        left: auto;
        right: 0;
      }
    }

  }
}
</style>
