<template>
  <div id="toolbar" @click.stop>
    <!-- <select class="ql-size">
            <option value="small" selected>小</option>
            <option value="large">大</option>
            <option value="huge">极大</option>
        </select>
        <select class="ql-header">
            <option :value="1">H1</option>
            <option :value="2">H2</option>
            <option value="3">H3</option>
        </select>
        <div class="ql-formats">
<button class="ql-header" value="1">H1</button>
        </div>
        <div class="ql-formats">
        <button class="ql-bold" value="1">加粗</button>
        </div>
        

        <button class="ql-italic">斜体</button>
        <button class="ql-color">字体颜色</button>
        <button class="ql-background">背景颜色</button>
        <button class="ql-direction">文字方向</button>
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-align" value="justify">左对齐</button>
        <button class="ql-align" value="center">居中</button>
        <button class="ql-align" value="right">右对齐</button>
        <button class="ql-link"></button>
        <button class="ql-underline"></button>
        <button class="ql-script" value="sub">下标</button>
        <button class="ql-script" value="super">上标</button> -->
    <!-- <span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-size"></select>
    </span> -->
    <span class="ql-formats">
      <!-- <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button> -->
      <select class="ql-header" title="标题">
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
        <option value="4">H4</option>
        <option value="5">H5</option>
        <option value="6">H6</option>
      </select>
      <button class="ql-bold" title="加粗"></button>
      <button class="ql-italic" title="斜体"></button>  
      <button class="ql-underline" title="下划线"></button>
      <button class="ql-strike" title="删除线"></button>
      <button class="ql-indent" value="-1" title="向前缩进"></button>
      <button class="ql-indent" value="+1" title="向后缩进"></button>
      <select class="ql-color" title="字体颜色"></select>
      <select class="ql-background" title="背景颜色"></select>
      <select class="ql-align" title="文本对齐"></select>
      <button class="ql-list" value="ordered" title="无序列表"></button>
      <button class="ql-list" value="bullet" title="有序列表"></button>
      <button class="ql-blockquote" title="引用"></button>
      <button class="ql-code-block" title="代码块"></button>
      <button class="ql-script" value="sub" title="下标"></button>
      <button class="ql-script" value="super" title="上标"></button>
      <button class="ql-link" title="链接"></button>
      <button class="ql-image" title="图片"></button>
      <button class="ql-video" title="视频"></button>
      <button class="ql-formula" title="公式"></button>
    </span>
    <!-- <span class="ql-formats">

    </span>
    <span class="ql-formats">

    </span>
    <span class="ql-formats">
      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>
      <button class="ql-header" value="3"></button>
      <button class="ql-header" value="4"></button>
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span> -->
    <!-- <span class="ql-formats">
      <button class="ql-direction" value="rtl"></button>
      <select class="ql-align"></select>
    </span> -->
    <!-- <span class="ql-formats">
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
      <button class="ql-formula"></button>
    </span> -->

    <span class="ql-formats">
      <button class="ql-clean" title="清除"></button>
    </span>
  </div>
</template>
<script>
export default {
  name: "Toolbar",
  data() {
    return {};
  },

  methods: {},
};
</script>
<style lang="scss">
#toolbar {
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  -webkit-app-region: no-drag;
  border: none;
  border-radius: 6px;
  background: #fff;
  .ql-formats {
    flex-shrink: 0;
    margin-right: 10px;
    &:first-of-type {
        margin-left: 10px;
    }
    .ql-header {
      width: 54px;
      .ql-picker-label {
          border: none;
        border-radius: 6px 0 0 6px;
        overflow: hidden;
        &::before {
            line-height: 24px;
        }
      }
      .ql-picker-item {
        // &[data-value="1"]::before {

        // }
      }
    }
  }
}
</style>