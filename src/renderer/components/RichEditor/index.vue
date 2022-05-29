<template>
  <div class="rich-editor" v-loading="loading">
    <!-- 工具栏 -->
    <!-- <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editorId="editorId"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    /> -->
    <template v-if="hasArticle">
      <div class="editor-title">
        <input type="text" class="editor-title-input" placeholder="请输入标题" v-model="article.title" @input="titleChange">
      </div>
      <!-- 编辑器 -->
      <Editor
        class="editor"
        :editorId="editorId"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
        @onDestroyed="onDestroyed"
        @onMaxLength="onMaxLength"
        @onFocus="onFocus"
        @onBlur="onBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
      />
    </template>
    <div v-else class="empty">
      <svg t="1638106622607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9775" width="256" height="256"><path d="M227.3 280.7c0 20.1 16.3 36.3 36.3 36.3 20.1 0 36.3-16.3 36.3-36.3 0-20.1-16.3-36.3-36.3-36.3-20 0-36.3 16.2-36.3 36.3 0 20.1 0 0 0 0z m167.9 3.5c0 20.1 16.3 36.3 36.3 36.3 20.1 0 36.3-16.3 36.3-36.3 0-20.1-16.3-36.3-36.3-36.3-20 0-36.3 16.2-36.3 36.3 0 20.1 0 0 0 0z m211.2 373.2c-1.7-1.6-4.3-1.2-5.8 0.6-1.6 1.8-1.2 4.3 0.6 5.8 0 0 2.9 2.5 7.8 6.8 0.8 0.8 1.7 1 2.7 1 1.2 0 2.3-0.4 3.1-1.4 1.6-1.7 1.4-4.3-0.4-5.8-4.9-4.2-7.8-6.8-8-7z m22.9 21c-1.7-1.6-4.3-1.6-5.8 0.2s-1.6 4.3 0.2 5.8c5.1 4.9 9.9 9.5 14.4 14.2 0.8 0.8 1.9 1.4 2.9 1.4s2.1-0.4 2.9-1.2c1.5-1.6 1.7-4.3 0.2-5.8-4.9-4.9-9.7-9.7-14.8-14.6z m143.6 77c-6.8 1.7-13.2 3.1-19.4 4.1-2.3 0.4-3.9 2.5-3.5 4.7 0.4 2.1 2.1 3.5 4.1 3.5h0.6c6.4-1 13.4-2.5 20.4-4.3 2.1-0.6 3.5-2.9 2.9-5.1-0.6-2.2-2.9-3.5-5.1-2.9z m74.2-30.7c-6 3.3-12 6.4-18.1 9.1-2.1 1-2.9 3.5-1.9 5.4 0.8 1.6 2.1 2.3 3.7 2.3 0.6 0 1.2-0.2 1.7-0.4 6-2.9 12.2-6 18.3-9.3 1.9-1.2 2.7-3.5 1.7-5.6-0.9-1.9-3.4-2.7-5.4-1.5z m-36.3 17.5c-6.4 2.7-12.6 5.1-18.9 7.2-2.1 0.8-3.3 3.1-2.5 5.2 0.6 1.8 2.1 2.7 3.9 2.7 0.4 0 1 0 1.4-0.2 6.2-2.1 12.6-4.7 19.2-7.4 2.1-1 3.1-3.3 2.1-5.4-0.7-1.9-3.1-3.1-5.2-2.1z m71.3-37.7c-5.8 3.7-11.7 7.2-17.3 10.5-1.9 1.2-2.7 3.7-1.6 5.6 0.8 1.4 2.1 2.1 3.5 2.1 0.8 0 1.4-0.2 2.1-0.6 5.6-3.3 11.7-6.8 17.5-10.5 1.9-1.2 2.5-3.7 1.4-5.6-1.1-1.9-3.6-2.9-5.6-1.5z m-148.4 56.7h-1c-6.6 0-12.8-0.6-18.5-1.8-2.3-0.4-4.5 1-4.9 3.3-0.4 2.3 1 4.5 3.3 4.9 6.2 1.4 13 1.9 20.2 1.9h1c2.3 0 4.1-1.9 4.1-4.1 0-2.5-1.9-4.2-4.2-4.2z m270.4-111.9l1.4-2.7h1.4c6.2 0 11.3-5.1 11.3-11.3 0-6.2-5.1-11.3-11.3-11.3s-11.3 5-11.3 11.3c0 2.7 1 5.4 2.7 7.4l-1.9 3.9c-2.1-0.4-4.5-0.6-6.8-0.6-7.8 0-14.8 2.5-20.6 6.8l-6.2-5.6c0.8-1.6 1.2-3.1 1.2-4.9 0-6.2-5-11.3-11.3-11.3-6.2 0-11.3 5.1-11.3 11.3 0 6.2 5.1 11.3 11.3 11.3 1.6 0 2.9-0.4 4.1-0.8l6 5.6c-1.4 1.6-2.5 3.1-3.5 4.9-1.6-0.6-2.9-1-4.7-1.4-0.2 0-0.4 0-0.4-0.2-2.9-0.6-5.8-1-8.9-1-17.5 0-32.1 16.1-34 26-1.2-0.4-2.3-0.2-3.5 0.6-2.9 1.9-5.8 3.9-8.5 5.8-1.9 1.2-2.5 3.9-1.2 5.8 0.8 1.2 2.1 1.9 3.5 1.9 0.8 0 1.6-0.2 2.3-0.8 2.7-1.7 5.6-3.7 8.4-5.6 3.5 9.3 15 20.4 28.8 22.3h0.4c1.2 0.2 2.5 0.2 3.7 0.2 7 0 13.4-1.8 18.9-4.7 0.4-0.2 0.6-0.4 1-0.6 1.4-0.8 2.7-1.7 3.9-2.7 5.8 4.1 12.8 6.6 20.4 6.6 19.2 0 35-15.7 35-35-0.1-13.5-8.4-25.6-20.3-31.2z m-51.6-3.9c-1.7 0-3.1-1.4-3.1-3.1 0-1.8 1.4-3.1 3.1-3.1 1.8 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1z m54.2-13c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.8 0-3.1-1.4-3.1-3.1 0-1.8 1.3-3.1 3.1-3.1z m-87.3 56.7c0-2.1 3.5-8 8.9-12.6-0.4 1.2-0.6 2.5-0.8 3.9-1.2 7.2-0.6 15.9 2.5 23.5-6.5-4.7-10.6-11.3-10.6-14.8z m25.9 20h-1.6c-8-6.8-9.3-18.5-8-27.4 1.2-7.4 3.9-10.7 4.7-11.1 0.6-0.2 1-0.6 1.4-1 1.2-0.2 2.3-0.4 3.5-0.4h0.2c-2.5 4.9-4.1 11.3-3.9 17.5 0.4 8.9 4.3 16.5 10.9 21.4-2.4 0.6-4.7 1-7.2 1z m16.7-4.8c-9.7-4.1-12-11.9-12.2-17.9-0.4-7.6 2.5-13.8 4.7-15.9 0.6 0.2 1 0.4 1.6 0.4-1 3.1-1.6 6.6-1.6 10.1 0 8.6 3.1 16.5 8.4 22.7-0.3 0.2-0.5 0.4-0.9 0.6z m27.4 3.5c-14.8 0-26.6-12-26.6-26.6 0-14.6 12-26.6 26.6-26.6 14.6 0 26.6 12 26.6 26.6 0 14.5-11.9 26.6-26.6 26.6z m0 0" p-id="9776" fill="#707070"></path><path d="M971.7 675.7c0 3.2 2.6 5.8 5.8 5.8 3.2 0 5.8-2.6 5.8-5.8 0-3.2-2.6-5.8-5.8-5.8-3.2 0-5.8 2.6-5.8 5.8 0 3.2 0 0 0 0z m25.1-2.5c0 3.2 2.6 5.8 5.8 5.8 3.2 0 5.8-2.6 5.8-5.8 0-3.2-2.6-5.8-5.8-5.8-3.2 0-5.8 2.6-5.8 5.8 0 3.2 0 0 0 0z m-241-427.9c4.9-1.6 24.7 3.7 39.6 18.1 8 7.8 16.5 20.4 12 36.7-1.2 4.5 1.4 8.9 5.6 10.3 0.8 0.2 1.6 0.4 2.3 0.4 3.7 0 7-2.3 8-6 5.2-18.9-0.6-37.9-16.5-53.2-16.5-15.9-42.9-26.2-56.4-22-4.3 1.4-6.8 6-5.4 10.5 1.9 4.3 6.6 6.6 10.8 5.2z m6-43.9c5.2-1 38.3 1 62.6 21 18.1 15 27.2 36.3 27.2 63.3 0 4.7 3.7 8.4 8.2 8.4 4.5 0 8.4-3.7 8.4-8.2 0.2-32.4-11.1-58.1-33.2-76.4-27.8-22.7-65.3-26.6-76.4-24.5-4.5 1-7.4 5.2-6.4 9.7 0.9 4.6 5.2 7.5 9.6 6.7zM176.2 696.7c-56.9-14.6-49.5-83.4-49.2-86.3 0.6-4.5-2.7-8.7-7.2-9.3-4.5-0.6-8.7 2.7-9.3 7.2-0.2 0.8-2.5 21.6 3.5 44.5 8.4 31.5 28.4 52.3 57.9 59.8 0.8 0.2 1.4 0.2 2.1 0.2 3.7 0 7-2.5 8-6.2 1.4-4.3-1.3-8.9-5.8-9.9z m0 0" p-id="9777" fill="#707070"></path><path d="M637.3 798.9l1-9.7 74.6-32.6c1.2-0.6 2.1-1.4 3.1-2.3L881.5 557c2.5-2.9 2.5-7.2 0.4-10.1-2.1-3.1-6.2-4.3-9.7-2.9l-53.6 21.4V451.9c0-2.5-1.2-4.9-3.1-6.4-1.9-1.6-4.7-2.1-7-1.6L736 460.8l-12.8-19.2c38.1-10.5 66.3-45.5 66.3-87 0-49.7-40.4-90.2-90.2-90.2-49.7 0-90.2 40.4-90.2 90.2 0 6 0.6 12 1.7 17.9l-72.1 5.6v-74.6c0-140.1-113.9-254-254-254s-254 113.9-254 254v534.9C10.9 850 0 862.8 0 876.2c0 53.8 177.2 97.5 396 97.5s396-43.7 396-97.5c-0.8-31.5-61-59.4-154.7-77.3z m23.5-37.7l14.4-16.5 0.6 1.2c1.7 2.3 3.7 4.5 5.6 6.4l-20.6 8.9z m154.1-176.6l32.4-13-143.2 170.6-14.2 6.2c-2.9-2.3-5.4-4.9-7.6-7.8-0.6-0.8-1.6-1.4-2.3-1.6l134.9-154.4z m-13.2-122.2v109.2L570.3 641l-6-123 237.4-55.6zM698.9 281.1c40.6 0 73.6 33 73.6 73.6 0 40.6-33 73.6-73.6 73.6-40.6 0-73.6-33-73.6-73.6 0-40.6 33-73.6 73.6-73.6z m-83.6 107.6c13.4 32.8 45.9 56.2 83.6 56.2 1.9 0 4.1 0 6-0.2l13.4 20.2-164.6 38.5c-3.9 1-6.6 4.5-6.4 8.6l5.2 108-132-215.9 194.8-15.4zM337.5 609.3c0-24.5-9.7-46.6-25.6-62.8l94-134.8 132.5 216.4-87.8-50.9c-3.5-1.9-7.8-1.2-10.5 1.7L312.4 728.7l-21.8-40.6c27.9-15.1 46.9-44.8 46.9-78.8z m-90.4 73.6c-40.6 0-73.6-33-73.6-73.6 0-40.6 33-73.6 73.6-73.6 40.6 0 73.6 33 73.6 73.6 0.1 40.6-32.9 73.6-73.6 73.6z m123.8 230c-25.3 3.3-54.2 5.2-86.7 5.2-155.6 0-224-48.8-237.4-59.5V303.4C46.8 172.5 153.3 66 284.3 66s237.4 106.5 237.4 237.4v76l-116 8.9c-0.2 0-0.6 0.2-0.8 0.2h-0.6l-1.8 0.6c-0.6 0.2-1.2 0.6-1.6 1l-1.5 1.5L299 535.4c-14.8-10.5-32.6-16.5-51.9-16.5-49.7 0-90.2 40.4-90.2 90.2 0 49.7 40.4 90.2 90.2 90.2 9.9 0 19.2-1.6 28.2-4.5l25.5 47.4-43.5 50.9c-1.7 1.9-2.3 4.5-1.7 7 0.6 2.5 2.1 4.7 4.5 5.8l116 56.9-5.2 50.1z m-94-116.9l40-47 0.4-0.4 131-153.5 101.4 58.7-167.1 194.1L276.9 796z m338.8 56.1l-229.5 75.2 6.4-62.8L621 795.2l-5.3 56.9zM409.8 842l157.6-183L785 593.9 671.1 724.3l-0.2-0.2c-3.9-5.1-8.2-10.5-13-15.9-1.6-1.7-4.1-1.9-5.8-0.4-1.7 1.6-1.9 4.1-0.4 5.8 4.7 5.4 8.9 10.7 12.6 15.5 0.4 0.6 1 1 1.5 1.2l-40.2 46.1L409.8 842z m0 0" p-id="9778" fill="#707070"></path></svg>
    </div>
  </div>
</template>
<script>
import { SlateTransforms } from '@wangeditor/editor'
import {
  Editor,
  Toolbar,
  getEditor,
  removeEditor 
} from "@wangeditor/editor-for-vue";
// import cloneDeep from "lodash.clonedeep";
import {mapState, mapMutations} from 'vuex'
export default {
  name: "RichEditor",

  components: { Editor, Toolbar },

  props: {
    defaultContent: {
      type: Array,
      default: () => []
    },

    saveSecond: {
      type: Number,
      default: 5
    }
  },

  data() {
    return {
      //【特别注意】
      // 1. editorId Toolbar 和 Editor 的关联，要保持一致
      // 2. 多个编辑器时，每个的 editorId 要唯一
      editorId: "w-e-1",
      toolbarConfig: {
        /* 工具栏配置 */
      },
      editorConfig: {
        placeholder: "请输入内容...",
        // 其他编辑器配置
        // 菜单配置
      },
      mode: "simple", // default or 'simple'
      curContent: [],
      article: {},
      title:'',
      timer: 0,
      timestamp: 0
    };
  },

  computed: {
    ...mapState({
      currentArticle: state => state.Home.currentArticle,
      loading: state => state.Home.loading
    }),
    hasArticle() {
      return this.article && !isNaN(this.article.article_id)
    }
  },

  watch: {
    currentArticle: {
      immediate: true,
      handler(article) {
        if ( !article ) return
        // 把正在编辑的笔记保存后，再切换下一篇笔记
        if(this.article && !isNaN(this.article.article_id)) {
          this.saveArticle({
            content: this.article.content
          })          
        }

        this.article = {...article}
        if(getEditor(this.editorId)) {
          this.reset(this.article.content)
        }
      }      
    }
  },

  mounted() {
    this.$queue.add('close', this.beforeClose)
  },

  // 及时销毁 editor
  beforeDestroy() {
    this.$queue.remove('close', this.beforeClose)
    this.destroyEditor()
  },

  methods: {
    ...mapMutations(['updateCurrentArticle', 'updateArticleListTitle', 'updateLoading']),

    // 手动重置
    reset(content) {
      const editor =  (this.editorId)
      if (editor == null) return
      editor.clear()
      // 不能直接赋值为空
      if ( content && content.length > 0) {
        SlateTransforms.insertNodes(editor, content)
        SlateTransforms.removeNodes(editor, { at: [0] })
      }
    },

    // 窗口关闭前保存内容
    async beforeClose() {
      if( !this.hasArticle ) return
      this.updateLoading(true)
      clearTimeout(this.timer)
      try {
        const params = {
          title: this.article.title,
          content: this.article.content
        }
        await this.$db.article.update(this.article.article_id, params);
      } catch (err) {
        console.error(err)
      }
      this.updateLoading(false)
    },

    onCreated(editor) {
      this.editor = Object.seal(editor)
      this.reset(this.article.content || [])
    },

    onChange(editor) {
      clearTimeout(this.timer)
      
      this.article.content = editor.children

      if(this.timestamp < Date.now() - 1000 * 30) {
        this.timestamp = Date.now()
        this.saveArticle({
          content: editor.children
        })
        return 
      }
      this.timer = setTimeout(() => {
        this.saveArticle({
          content: editor.children
        })
      }, 5000)
    },

    onDestroyed(editor) {
    },
    onMaxLength(editor) {
    },
    onFocus(editor) {
    },
    onBlur(editor) {
    },
    customAlert(info, type) {
    },
    customPaste(editor, event, callback) {

      // 自定义插入内容
      // editor.insertText(clipboard.readText());

      // 返回值（注意，vue 事件的返回值，不能用 return）
      // callback(false); // 返回 false ，阻止默认粘贴行为
      callback(true) // 返回 true ，继续默认的粘贴行为
    },

    insertText() {
      // 获取 editor 实例，即可执行 editor API
      const editor = getEditor(this.editorId);
      if (editor == null) return;
      if (editor.selection == null) return;

      // 在选区插入一段文字
      editor.insertText("一段文字");
    },

    destroyEditor() {
      const editor = getEditor(this.editorId);
      if (editor == null) return;

      // 销毁，并移除 editor
      editor.destroy();
      removeEditor(this.editorId);
    },

    // 获取数据
    getData() {
      const editor = getEditor(this.editorId)
      return {
        json: JSON.stringify(editor.children) || [],
        html: editor.getHtml() || ''
      }
    },

    // 保存标题
    titleChange() {
      this.saveArticle({
        title: this.article.title
      })
      this.updateArticleListTitle({
        ...this.article,
        title: this.article.title
      })
    },

    // 保存更新
    saveArticle(data) {
      if( !this.hasArticle) return

      try {
        const params = {
          id: this.article.article_id,
          data
        }
        this.$db.article.updateAsync(params);
      } catch (err) {
        console.error(err)
      }
    },

    // 备份
    backup() {
      const editor = getEditor(this.editorId)
      
      return {
        title: this.title,
        content: editor.children
      }
      // this.updateCurrentArticle()
    }
  },

};
</script>
<style lang="scss">
  .rich-editor {
    .w-e-text-container {
      h1,h2,h3,h4,h5,h6,strong {
        font-weight: 700;
      }
      em {
        font-style: italic;
      }
      h1 {
        font-size: 22px;
      }
      h2 {
        font-size: 20px;
      }
      h3 {
        font-size: 18px;
      }
      h4 {
        font-size: 16px;
      }
      h5 {
        font-size: 14px;
      }
      h6 {
        font-size: 12px;
      }
      p {
        margin: 0;
        font-size: 14px;
        line-height: 1.8;
      }
    }
  }
</style>
<style scoped lang="scss">
  .rich-editor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .empty {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        width: 30vh;
        height: 30vh;
      }
    }
  }
  .editor-title {
    padding: 8px 20px;
    border-bottom: 1px solid #eee;
    .editor-title-input {
      width: 100%;
      height: 24px;
      border: none;
      outline: none;
      font-size: 18px;
      font-weight: 700;
    }
  }
  .editor {
    width: 100%;
    flex: 1;
    overflow-y: auto;
  }
</style>