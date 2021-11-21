<template>
  <div class="categorys" v-contextmenu:listContextmenu>
    <!-- <div class="cate-add">
      <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="createNew"></el-button>
      <span class="cate-add-label">新建分类</span>
    </div> -->
    <ul class="cate-list">
      <li
        class="cate-item"
        :class="{ active: activeId === item.cate_id }"
        v-contextmenu:itemContextmenu
        v-for="item in list"
        :key="item.cate_id"
        :title="item.label"
        :item="item"
        @contextmenu.stop
        @click="selectCate(item)"
        @dblclick="openEdit(item)"
      >
        <div class="cate-item-info" v-if="!updateItem || updateItem.cate_id !== item.cate_id">
          <span class="cate-item-label">{{ item.label }}</span>
          <i
            class="el-icon-close cate-item-del"
            title="删除"
            @click="del(item)"
          ></i>
        </div>
        <div v-else>
          <el-input
            placeholder="请输入名称"
            size="mini"
            :ref="'input_' + item.cate_id"
            v-model="item.label"
            @click.stop
            @click.native.stop
            @change="saveUpdate(item)"
            @keyup.native.enter="saveUpdate(item)"
            @keyup.native.esc="exitUpdate(item)"
          ></el-input>
        </div>
      </li>
    </ul>
    <v-contextmenu ref="listContextmenu">
      <v-contextmenu-item @click="createNew">新建分类</v-contextmenu-item>
    </v-contextmenu>
    <v-contextmenu ref="itemContextmenu">
      <v-contextmenu-item>重命名</v-contextmenu-item>
      <v-contextmenu-item @click="delCate">删除</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: "Categorys",

  components: {},

  data() {
    return {
      list: [],
      updateItem: null,
      activeId: -1,
      oldUpdateLabel: "",
    };
  },

  computed: {
    ...mapState([])
  },

  created() {
    // this.$db.category.add('测试1')

    this.init();
  },

  mounted() {
    document.body.addEventListener('click', this.bodyClick)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.bodyClick)
  },

  methods: {
    ...mapMutations(['updateCurrentCate']),

    init() {
      this.getList();
      const first = this.list[0]
      first && this.selectCate(first)
    },

    selectCate(item) {
      if( this.activeId === item.cate_id ) return
      this.activeId = item.cate_id;
      this.updateCurrentCate(item)
      this.$channel.$emit('select-cate', item)
    },

    bodyClick(){
      if( this.updateItem ) {
        this.saveUpdate(this.updateItem)
      }
    },

    getList() {
      try {
        this.list = this.$db.category.getList();
        console.log("分类列表", this.list);
      } catch (err) {
        console.err(err);
      }
    },

    // 获取相同的名称数量
    getSameLabelCount(label) {
      if (!label) return;
      try {
        return this.$db.category.getSameLabelCount(label);
      } catch (err) {
        console.error(err);
      }
    },

    createNew() {
      // const id = this.getSameLabelCount('新建分类')
      const item = this.add("新建分类");
      this.list.unshift(item);
      this.openEdit(item);
    },

    add(label) {
      if (!label) return null;
      try {
        const info = this.$db.category.add(label);
        if (info.changes >= 1) {
          const data = this.$db.category.get(info.lastInsertRowid);
          return data;
        }
      } catch (err) {
        console.error(err);
      }
      return null;
    },

    // 删除分类
    delCate() {
      this.del({
        cate_id: this.activeId
      })
    },

    del(item) {
      try {
        const info = this.$db.category.del(item.cate_id);
        console.log(info);
        if (info.changes > 0) {
          this.getList();
        }
      } catch (err) {
        console.error(err);
      }
    },

    // 打开编辑输入框
    openEdit(item) {
      this.updateItem =  item
      this.oldUpdateLabel = item.label;
      const refKey = "input_" + item.cate_id;
      this.$nextTick(() => {
        this.$refs[refKey] &&
          this.$refs[refKey][0] &&
          this.$refs[refKey][0].focus();
      });
    },

    // 保存修改操作
    saveUpdate(item) {
      if( !item.label ) return
      this.update(item.cate_id, item.label)
      this.oldUpdateLabel = ''
      this.updateItem = null
    },

    // 退出修改
    exitUpdate(item) {
      item.label = this.oldUpdateLabel
      this.oldUpdateLabel = ''
      this.updateItem = null
    },

    // 修改
    update(cate_id, label) {
      try {
        const info = this.$db.category.update(
          cate_id,
          label
        );
        if (info.changes >= 1) {
          return true
        }
      } catch (err) {
        console.error(err)
      }
      return false
    },
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
  background: #e3e3e3;
  // background: linear-gradient(to bottom, #5b5b5b, #2c2e32);
    // background: linear-gradient(to bottom, #e4e4e4, #b9b9b9);
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
    flex: 1;
    width: 100%;
    padding: 10px 0;
    box-sizing: border-box;
    overflow-y: auto;
    .cate-item {
      padding: 6px 10px;
      box-sizing: border-box;
      cursor: pointer;
      // border-bottom: 1px solid #f1f1f1;

      &:hover {
        // background: rgba(0, 0, 0, 0.2);
        background-color: #d4d4d4;
        .cate-item-info {
          .cate-item-label {
            color: #454545;
            // transform: scale(1.1);
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
        background-color: #c3c3c3;
        // background: rgba(0, 0, 0, 0.45);
        .cate-item-info {
          .cate-item-label {
            color: #333;
            transform: scale(1.1);
          }
        }
      }

      .cate-item-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .cate-item-label {
          transform-origin: left;
          flex: 1;
          line-height: 24px;
          // color: #efefef;
          color: #656565;
          font-size: 14px;
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
            transform: scale(1.2);
          }
        }
      }
    }
  }
}
</style>
