import { createUuid } from '../../utils/uuid'
class ContextMenu {
    id = null
    wrap = null
    menus = []
    classList = []
    close = () => {}
    constructor({wrap, menus, close}) {
        this.id = createUuid()
        this.wrap = wrap
        this.menus = menus
        this.classList = menus.map(e => e.classname)
    }

    init() {
        this.wrap.addEventListener('contextmenu', this.rightClick)
        document.body.addEventListener('click', this.bodyClick)
    }

    destroy() {
        this.wrap.removeEventListener('contextmenu', this.rightClick)
        document.body.removeEventListener('click', this.bodyClick)
    }

    rightClick(e) {
        const target = e.path.find(element => {
            if(!element.classList) return
            return this.classList.some(classname => {
                return element.classList.contains(classname)
            })
        })

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
    }

    createHtml() {
        `
            <div class="menu-wrap" ref="menuWrap" v-if="show && menuList.length > 0" :style="style">
                <ul class="menu-list">
                    <li class="menu-item" v-for="(item, index) in menuList" :key="index" @click.stop="itemClick(item)">{{item.label}}</li>
                </ul>
            </div>
        `
    }

    bodyClick() {

    }
}

class ContextmenuManger {
    static instance = null
    queue = []
    constructor() {

    }
    static getInstance() {
        if(!ContextmenuManger.instance) {
            ContextmenuManger.instance = new ContextmenuManger()
        }
        return ContextmenuManger.instance
    }
    push(item) {
        if(this.queue.length === 0) {
            document.body.addEventListener('click', this.bodyClick)
        }
        this.queue.push(item)
    }
    remove(item) {
        const index = this.queue.indexOf(item)
        if(index !== -1) {
            this.queue.splice(index, 1)
        }
        if(this.queue.length === 0) {
            document.body.removeEventListener('click', this.bodyClick)
        }
    }
    broadcast(contextmenu) {
        console.log()
        this.queue.forEach(item => {
            if(contextmenu !== item) {
                item.globalContextmenuClick()
            }
        })
    }
    bodyClick = e => {
        this.queue.forEach(item => {
            item.bodyClick()
        })
    }
}

export const contextmenuManger = ContextmenuManger.getInstance()