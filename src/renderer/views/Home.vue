<template>
  <div class="home">
    <div class="home-btns">
      <div class="home-btns-wrap">
        <div class="browser">
          <span
            class="browser-btn browser-red"
            title="关闭"
            @click="windowEvent('close')"
          ></span>
          <span
            class="browser-btn browser-yellow"
            title="最小化"
            @click="windowEvent('min')"
          ></span>
          <span
            class="browser-btn browser-green"
            title="最大化"
            @click="windowEvent('max')"
          ></span>
        </div>
        <div class="module-btns home-btns-left">
          <span
            class="home-top-btn"
            :class="{ active: cateIsOpen }"
            :title="articleIsOpen ? '打开分类列表' : '关闭分类列表'"
            @click="toggleViewOpen('cateIsOpen')"
          >
            <i v-if="cateIsOpen" class="el-icon-folder-opened"></i>
            <i v-else class="el-icon-folder"></i>
          </span>
          <span
            class="home-top-btn"
            :class="{ active: articleIsOpen }"
            :title="articleIsOpen ? '打开文章列表' : '关闭文章列表'"
            @click="toggleViewOpen('articleIsOpen')"
          >
            <i v-if="articleIsOpen" class="el-icon-document-copy"></i>
            <i v-else class="el-icon-tickets"></i>
          </span>
        </div>
        <!-- <div class="module-btns home-btns-left">
          <span
            class="home-top-btn"
            :class="{ active: searchIsOpen }"
            title="搜索"
            @click="toggleViewOpen('searchIsOpen')"
          >
            <i class="el-icon-search"></i>
          </span>
          <transition
            enter-active-class="search-enter-active"
            leave-active-class="search-leave-active"
          >
            <span v-if="searchIsOpen" class="home-top-btn search-top-btn">
              <el-input
                class="search-input"
                placeholder="搜索"
                size="mini"
                v-model="searchLabel"
                @click.stop
                @click.native.stop
                @keyup.native.enter="search"
              ></el-input>
            </span>
          </transition>
        </div> -->
        <div class="home-btns-right">
          <Toolbar></Toolbar>
        </div>
      </div>
    </div>
    <div class="home-content">
      <Categorys ref="category" :style="cateStyle"></Categorys>
      <Articles
        ref="article"
        :style="articleStyle"
        :searchContent="searchContent"
      ></Articles>
      <div class="editor-wrap">
        <div id="editor" class="editor-content">
          <div class="title">
            <input
              v-if="currentArticle"
              type="text"
              class="title-input"
              placeholder="请输入标题"
              v-model="title"
              @input="titleInput"
            />
          </div>

          <quill-editor
            v-show="currentArticle"
            ref="myQuillEditor"
            class="editor-container"
            :content="html"
            :options="editorOption"
            @change="onChange($event)"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import Categorys from "../components/Category";
import Articles from "../components/Article";
import { mapState, mapMutations, mapActions } from "vuex";
import { quillEditor, Quill } from "vue-quill-editor";
import hljs from "highlight.js";
import Toolbar from "../components/Quill/Toolbar.vue";
export default {
  name: "Home3",

  components: {
    Categorys,
    Articles,
    quillEditor,
    Toolbar,
  },

  data() {
    return {
      searchLabel: "",
      title: "",
      html: "",
      cateIsOpen: true,
      articleIsOpen: true,
      searchIsOpen: true,
      searchContent: "",
      editorOption: {
        boundary: document.body,
        modules: {
          formula: false,
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
          toolbar: "#toolbar",
          history: {
            delay: 2000,
            maxStack: 100,
            userOnly: true
          },
          keyboard: {
            bindings: {
              custom: {
                key: 'Z',
                shortKey: true,
                handler: function(range, context) {
                  if(this.quill.history.stack.undo.length > 0) {
                    return true
                  } else {
                    return false
                  }
                }
              },
            }
          }
        },
        placeholder: "",
        theme: "snow",
      },
      beforeTime: 0,
      timer: 0,
    };
  },

  computed: {
    ...mapState({
      currentArticle: (state) => state.Main.currentArticle,
    }),
    cateStyle() {
      return {
        width: this.cateIsOpen ? "160px" : 0,
        overflow: this.cateIsOpen ? "hidden" : "auto",
      };
    },
    articleStyle() {
      return {
        width: this.articleIsOpen ? "200px" : 0,
        overflow: this.articleIsOpen ? "hidden" : "auto",
      };
    },
  },

  watch: {
    currentArticle: {
      immediate: true,
      handler(article) {
        if(this.$refs.myQuillEditor && this.$refs.myQuillEditor.quill) {
          this.$refs.myQuillEditor.quill.history.clear()
        } 
        if (article) {
          this.selectArticle(article);
        } else {
          this.html = ''
          this.title = ''
        }
      },
    },
  },

  created() {},

  mounted() {
    // 关闭拼写检查
    this.$refs.myQuillEditor && this.$refs.myQuillEditor.quill.root.setAttribute('spellcheck', false)
    document.body.addEventListener("click", this.bodyClick)
  },

  destroyed() {
    document.body.removeEventListener("click", this.bodyClick)
  },

  methods: {
    ...mapMutations(['SET']),
    ...mapActions(['updateArticle', 'getArticleDetail']),

    bodyClick() {
      this.$refs.category && this.$refs.category.bodyClick()
      this.$refs.article && this.$refs.article.bodyClick()
    },

    onChange({ quill, html, text }) {
      this.html = html
      if(html === this.currentArticle.content) {
        return
      }
      this.timeUpdateArticle()
    },

    titleInput() {
      if (!this.currentArticle) return
      this.updateArticle({
        article_id: this.currentArticle.article_id,
        title: this.title
      })
    },

    // 搜索
    search() {},

    async selectArticle(article) {
      const data = await this.getArticleDetail({
        article_id: article.article_id
      })
      setTimeout(() => {
        this.html = data.content
        this.title = data.title
      })
    },

    // 切换视图显示/隐藏
    toggleViewOpen(name) {
      if (name) {
        this[name] = !this[name]
      }
    },

    windowEvent(type) {
      ipcRenderer.send("render-event", type)
    },

    // 定时保存
    timeUpdateArticle() {
      const now = Date.now()
      clearTimeout(this.timer)
      if (now - this.beforeTime > 5000) {
        this.beforeTime = now
        this.updateArticleOperate()
      } else {
        this.timer = setTimeout(() => {
          this.updateArticleOperate();
        }, 100);
      }
    },

    // 立即保存
    immediateSave() {
      clearTimeout(this.timer)
      this.updateArticleOperate()
    },

    async updateArticleOperate() {
      if (!this.currentArticle) return
      this.updateArticle({
        article_id: this.currentArticle.article_id,
        title: this.title,
        content: this.html
      })
    },
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
  background: var(--theme-color);
  background: linear-gradient(
    to bottom,
    var(--linear-start-color),
    var(--linear-end-color)
  );
  .home-btns {
    width: 100%;
    padding: 10px 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    flex-shrink: 0;
    -webkit-app-region: drag;
    .home-btns-wrap {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
    }

    .browser {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin: 0 10px;
      .browser-btn {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        -webkit-app-region: no-drag;
        & + .browser-btn {
          margin-left: 6px;
        }
        &:hover {
          transform: scale(1.2);
        }
      }

      .browser-red {
        background-color: #fb4648;
      }
      .browser-yellow {
        background-color: #fbb323;
      }
      .browser-green {
        background-color: #2cc232;
      }
    }

    .module-btns {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin: 0 10px;
      -webkit-app-region: no-drag;
      .home-top-btn {
        display: block;
        height: 24px;
        padding: 0 10px;
        line-height: 24px;
        cursor: pointer;
        transition: all 0.2;
        color: #fff;
        background: rgba(0, 0, 0, 0.2);
        font-size: 14px;

        &:first-of-type {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }

        &:last-of-type {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        &.active {
          background-color: #ffffff;
          color: var(--linear-start-color);
        }
      }
      .search-top-btn {
        padding: 0 10px 0 0;
        overflow: hidden;
        background-color: #fff;
        &:hover {
          background-color: #fff;
        }
        .search-input {
          width: 160px;
          padding: 0;
          -webkit-app-region: no-drag;
          /deep/.el-input__inner {
            height: 24px;
            padding: 0 10px;
            border-radius: 0;
            line-height: 24px;
            border: none;
            vertical-align: top;
            padding: 0;
            font-size: 11px;
            &::placeholder {
              font-size: 11px;
            }
          }
        }
      }
      .search-enter-active {
        animation: searchInputEnter 0.15s;
      }
      .search-leave-active {
        animation: searchInputLeave 0.15s;
      }
      @keyframes searchInputEnter {
        from {
          width: 0;
          opacity: 0;
        }
        to {
          width: 160px;
          opacity: 1;
        }
      }
      @keyframes searchInputLeave {
        from {
          width: 160px;
          opacity: 1;
        }
        to {
          width: 0;
          opacity: 0;
        }
      }
    }
    .home-btns-left {
      display: flex;
      justify-content: center;
    }
    .home-btns-middle {
      display: flex;
      justify-content: center;
    }
    .home-btns-right {
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
      padding-right: 20px;
    }
  }
  .home-content {
    width: 100%;
    flex: 1;
    display: flex;
    overflow: hidden;
  }
}
.editor-wrap {
  flex: 1;
  height: 100%;
  padding: 0 3px;
  overflow: hidden;
  border-left: 1px solid #ccc;
  background-color: #fff;
  .editor-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .editor-container {
    flex: 1;
    margin: 5px 0;
    overflow: hidden;
    border: none;
    position: relative;
    /deep/.ql-container {
      border: none;
      .ql-editor {
        padding: 7px 10px;
      }
    }
  }
}

.title {
  height: 24px;
  flex-shrink: 0;
  padding: 8px 20px;
  border-bottom: 1px solid #eee;
  .title-input {
    width: 100%;
    height: 24px;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
