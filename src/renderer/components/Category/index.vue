<template>
  <div class="categorys">
    <ContextMenu
      :menus="contextmenuList"
      @newCate="newCate"
      @updateCateOperate="updateCateOperate"
      @delCateOperate="delCateOperate"
    >
      <ul class="cate-list">
        <li
          class="cate-item"
          :class="{ active: activeId === item.cate_id }"
          v-for="item in cateList"
          :key="item.cate_id"
          :data-id="item.cate_id"
          :title="item.label"
          :item="item"
          @click="selectCate(item)"
          @dblclick="openEdit(item)"
        >
          <div
            class="cate-item-info"
            v-if="!updateItem || updateItem.cate_id !== item.cate_id"
          >
            <span class="cate-item-label cate-test">{{ item.label }}</span>
          </div>
          <div v-else>
            <el-input
              placeholder="请输入名称"
              size="mini"
              :ref="'input_' + item.cate_id"
              v-model="editLabel"
              @click.stop
              @click.native.stop
              @change="saveUpdate(item)"
              @keyup.native.enter="saveUpdate(item)"
              @keyup.native.esc="exitUpdate(item)"
            ></el-input>
          </div>
        </li>
      </ul>
    </ContextMenu>
  </div>
</template>

<script>
import ContextMenu from "../ContextMenu/index"
import { mapState, mapMutations, mapActions } from "vuex"
export default {
  name: "Categorys",

  components: {
    ContextMenu,
  },

  data() {
    return {
      updateItem: null,
      activeId: -1,
      editLabel: "",
      contextmenuList: [
        {
          label: "新建分类",
          eventName: "newCate",
          classname: "categorys",
        },
        {
          label: "新建分类",
          eventName: "newCate",
          classname: "cate-item",
        },
        {
          label: "重命名",
          eventName: "updateCateOperate",
          classname: "cate-item",
        },
        {
          label: "删除",
          eventName: "delCateOperate",
          classname: "cate-item",
        },
      ],
    };
  },

  computed: {
    ...mapState({
      currentCate: state => state.Main.currentCate,
      cateList: state => state.Main.cateList
    }),
  },

  created() {
    this.init();
  },

  mounted() {
    document.body.addEventListener("contextmenu", this.bodyClick)
  },

  beforeDestroy() {
    document.body.removeEventListener("contextmenu", this.bodyClick)
  },

  methods: {
    ...mapMutations(['SET']),
    ...mapActions(["getCateList", 'addCate', 'delCate', 'updateCate']),

    async init() {
      await this.getCateList()
      // 默认选择项
      const defaultCate = localStorage.getItem("default-cate")
      if (!defaultCate) return
      const selected = this.cateList.find( cate => String(cate.cate_id) === String(defaultCate))
      selected && this.selectCate(selected, true)
    },

    // 选中分类
    selectCate(item, notUser) {
      if (this.activeId === item.cate_id) return
      this.activeId = item.cate_id
      this.SET({
        currentCate: item
      })
      if (!notUser) {
        localStorage.setItem("default-cate", item.cate_id)
      }
    },

    bodyClick() {
      if (this.updateItem) {
        this.saveUpdate(this.updateItem);
      }
    },

    // 获取相同的名称数量
    async getSameLabelCount(label) {
      if (!label) return;
      try {
        const { code, data, msg } = await this.$fetch(
          "/category/getSameLabelCount",
          { label }
        );
        if (code === 0) {
          return data;
        } else {
          return;
        }
      } catch (err) {
        console.error(err);
      }
    },

    // 新增
    async newCate(e) {
      const item = await this.addCate({ label: '新建分类' })
      this.openEdit(item)
    },

    // 修改
    updateCateOperate(e) {
      const cate = this.cateList.find( (item) => item.cate_id.toString() === e.dataset.id )
      if (cate) {
        this.openEdit(cate)
      }
    },

    // 删除
    async delCateOperate(e) {
      const cate = this.cateList.find(
        (item) => item.cate_id.toString() === e.dataset.id
      )
      if (cate) {
        this.delCate({
          cate_id: cate.cate_id
        })
      }
    },

    // 打开编辑输入框
    openEdit(item) {
      this.updateItem = item
      this.editLabel = item.label
      const refKey = "input_" + item.cate_id
      this.$nextTick(() => {
        this.$refs[refKey] &&
          this.$refs[refKey][0] &&
          this.$refs[refKey][0].focus()
      });
    },

    // 保存修改操作
    saveUpdate(item) {
      this.updateCate({
        cate_id: item.cate_id,
        label: this.editLabel || ''
      })
      this.editLabel = ""
      this.updateItem = null
    },

    // 退出修改
    exitUpdate() {
      this.editLabel = ""
      this.updateItem = null
    }
  },
};
</script>

<style scoped lang="scss">
.categorys {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.15s;
  // background-color: #3c3940;
  // background: #e3e3e3;
  // background: linear-gradient(to bottom, #5b5b5b, #2c2e32);
  // background: linear-gradient(to bottom, #e4e4e4, #b9b9b9);
  .top-wrap {
    display: flex;
    justify-content: center;
    padding: 7px;
    border-bottom: 1px solid #eee;
    .top-btns {
      width: 100px;
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
      .add-btn,
      .remove-btn {
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
  .cate-add {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 10px 0;
    .cate-add-label {
      margin-left: 10px;
      font-size: 14px;
      color: #fff;
    }
  }
  .cate-list {
    width: 100%;
    height: 100%;
    padding: 0 0 10px 0;
    box-sizing: border-box;
    overflow-y: auto;
    .cate-item {
      padding: 6px 10px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background-color: var(--active-color);
        background-color: rgba(255, 255, 255, 0.3);
        .cate-item-info {
          .cate-item-label {
            // color: #454545;
            // color:  var(--theme-color);
          }
          .cate-item-del {
            width: auto;
            height: auto;
            overflow: auto;
            opacity: 1;
          }
        }
      }

      &.active {
        background-color: rgba(255, 255, 255, 1);
        .cate-item-info {
          .cate-item-label {
            // color: #303133;
            color: var(--theme-color);
          }
        }
      }

      .cate-item-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .cate-item-label {
          height: 24px;
          transform-origin: left;
          flex: 1;
          line-height: 24px;
          // color: #efefef;
          color: #fff;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cate-item-del {
          width: 0;
          height: 0;
          overflow: hidden;
          flex-shrink: 0;
          margin-left: 10px;
          color: #333;
          opacity: 0;
          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}
</style>
