<template>
  <div class="rich-editor">
    <!-- 工具栏 -->
    <!-- <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editorId="editorId"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    /> -->
    <div class="editor-title">
      <input type="text" class="editor-title-input" placeholder="请输入标题" v-model="title" @input="titleChange">
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
import cloneDeep from "lodash.clonedeep";
import {mapState, mapMutations} from 'vuex'
const { clipboard } = require('electron')
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
      content:[],
      editorConfig: {
        placeholder: "请输入内容...",
        // 其他编辑器配置
        // 菜单配置
      },
      mode: "simple", // default or 'simple'
      curContent: [],
      article: {},
      title:'',
    };
  },

  computed: {
    ...mapState({
      currentArticle: state => state.Home.currentArticle
    }),
  },

  watch: {
    currentArticle: {
      immediate: true,
      handler(article) {
        if ( !article ) return

        this.article = article
        this.title = article.title
        this.content = article.content ? JSON.parse(article.content) : []
        if(getEditor(this.editorId)) {
          this.reset(this.content)
        }
      }      
    }
  },

  mounted() {

  },

  // 及时销毁 editor
  beforeDestroy() {
    this.destroyEditor()
  },

  methods: {
    ...mapMutations(['updateCurrentArticle', 'updateArticleListTitle']),

    // 手动重置
    reset(content) {
      const editor = getEditor(this.editorId)
      if (editor == null) return
      editor.clear()
      // 不能直接赋值为空
      if ( content && content.length > 0) {
        SlateTransforms.insertNodes(editor, content)
        SlateTransforms.removeNodes(editor, { at: [0] })
      }
    },

    onCreated(editor) {
      this.reset(this.content)
    },

    onChange(editor) {
      this.saveArticle({
        content: JSON.stringify(editor.children)
      })
    },

    onDestroyed(editor) {
      console.log("onDestroyed", editor);
    },
    onMaxLength(editor) {
      console.log("onMaxLength", editor);
    },
    onFocus(editor) {
      console.log("onFocus", editor);
    },
    onBlur(editor) {
      console.log("onBlur", editor);
    },
    customAlert(info, type) {
      window.alert(`customAlert in Vue demo\n${type}:\n${info}`);
    },
    customPaste(editor, event, callback) {
      console.log("ClipboardEvent 粘贴事件对象", event);

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
        title: this.title
      })
      this.updateArticleListTitle({
        ...this.currentArticle,
        title: this.title
      })
    },

    // 保存更新
    saveArticle(data) {
      if( !this.currentArticle || !this.currentArticle.article_id ) return

      try {
        const params = {
          id: this.currentArticle.article_id,
          ...data
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
    strong {
      font-weight: 700;
    }
    em {
      font-style: italic;
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