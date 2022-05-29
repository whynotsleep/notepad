<template>
    <div class="context-menu" ref="contextMenu">
        <slot></slot>
        <div class="menu-wrap" ref="menuWrap" v-if="show && menuList.length > 0" :style="style">
            <ul class="menu-list">
                <li class="menu-item" v-for="(item, index) in menuList" :key="index" @click.stop="itemClick(item)">{{item.label}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
import { contextmenuManger } from './manger'
export default {
    name: 'ContextMenu',
    props: {
        classname: {
            type: Array,
            default: () => []
        },
        menus: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            show: false,
            x: 0,
            y: 0,
            menuList: [],
            target: null
        }
    },
    computed: {
        style() {
            return {
                left: this.x + 'px',
                top: this.y + 'px'
            }
        },

        classList() {
            return this.menus.filter(e => e.classname).map(e => e.classname)
        }
    },
    created() {
   
    },
    mounted() {
        this.$refs.contextMenu.addEventListener('contextmenu', this.contextMenu)
        contextmenuManger.push(this)
    },
    beforeDestroy() {
        this.$refs.contextMenu.removeEventListener('contextmenu', this.contextMenu)
        contextmenuManger.remove(this)
    },
    methods: {
        contextMenu(e) {
            const target = e.path.find(element => {
                if(!element.classList) return
                return this.classList.some(classname => {
                    return element.classList.contains(classname)
                })
            })

            this.target = target

            if(target) {
                this.menuList = this.menus.filter(menu => {
                    if(!menu.classname) return true
                    return target.classList.contains(menu.classname)
                })
            } else {
                this.menuList = this.menuList.filter(menu => !menu.classname)
            }

            const clientWidth = document.documentElement.clientWidth
            const clientHeight = document.documentElement.clientHeight
            this.x = e.pageX
            this.y = e.pageY
            this.show = true
            contextmenuManger.broadcast(this)
            this.$nextTick(() => {
                const wrap = this.$refs.menuWrap
                
                if(e.pageY + wrap.clientHeight >= clientHeight) {
                    this.y = e.pageY - wrap.clientHeight
                }
                if(e.pageX + wrap.clientWidth >= clientWidth) {
                    this.x = e.pageX - wrap.clientWidth
                }
            })
            return false
        },

        close() {
            this.show = false
            this.x = 0
            this.y = 0            
        },

        bodyClick(e) {
            this.close()
        },

        itemClick(item) {
            this.close()
            if(item.eventName) {
                this.$emit(item.eventName, this.target)
            }
        },

        globalContextmenuClick() {
            this.close()
        }
    }
}
</script>
<style lang="scss" scoped>
    .context-menu {
        width: 100%;
        height: 100%;
        .menu-wrap {
            width: 140px;
            position: fixed;
            z-index: 1000;
            border: 1px solid #d3d3d3;
            background: #fff;
            box-shadow: 2px 2px 3px 0px #0000007d;
            transition: all 0.1s;
            .menu-list {
                width: 100%;
                margin: 0;
                padding: 5px 0;
                .menu-item {
                    width: 100%;
                    height: 30px;
                    box-sizing: border-box;
                    padding: 5px 15px;
                    line-height: 20px;
                    color: #333;
                    font-size: 12px;
                    cursor: pointer;
                    &:hover {
                        background-color: #e1e1e1;
                    }
                }
            }
        }
    }
</style>