// 需要解决的问题：连续写入数据库会非常卡顿，需要有一个管理写入的方法，同一篇文章在短时间内多次写入，只写入最后一次，同时缓存写入的内容
// 
// 设计原理
// 
export class Session {
    constructor() {
        
    }

    set(key, data) {
        this[key] = data
    }

    get(key) {
        return this[key]
    }

    remove(key) {
        delete this[key]
    }
}

export const session = new Session()

class NoteSession {
    constructor() {
        session.set('cate', []) //结构 {cate_id: {cate_id: 1, label: '分类'}}
        session.set('cateConcatArticleIds', {}) // 结构{cate_id: articleIds[1, 2]}
        session.set('article', {}) // 结构{article_id: {article_id: 1, title: '文章标题'}}
    }

    // 保存分类列表
    setCateList(data) {
        session.set('cate', data)
    }

    // 获取分类列表
    getCateList() {
        session.get('cate')
    }

    // 保存分类信息
    setCate(id, newValue) {
        const data = session.get('cate')
        const index = data.findIndex(item => item.cate_id === id)
        if(index === -1) return false
        data[index] = newValue
        return true
    }

    // 获取分类信息
    getCate(id) {
        const data = session.get('cate') || []
        return data.filter(e => e.cate_id === id)[0]
    }

    // 根据分类Id设置文章列表
    setArticlesByCateIds(cateId, articles) {
        const cateArticleIds = session.get('cateConcatArticleIds')
        cateArticleIds[cateId] = Array.isArray(articles) ? articles : [articles]
    }

    // 根据分类Id获取文章列表
    getArticlesByCateId(cateId) {
        const cateArticleIds = session.get('cateConcatArticleIds')
        const articleIds = cateArticleIds[cateId]
        if(!articleIds) return false
        const article = session.get('article') || {}
        return articleIds.map(artcleId => {
            return article[artcleId]
        })
    }

    // 保存文章
    setArticle(id, newValue) {
        const article = session.get('article')
        article[id] = {...newValue}
    }

    // 获取文章
    getArticle(id) {
        return session.get('article')[id]
    }

    delArticle(id) {
        delete session.get('article')[id]
    }
}

export const nSession = new NoteSession()

export default class Queue {
    memory = {}
    queue = []

    constructor() {

    }

    async push(id, callback) {
        // 缓存
        this.memory[id] = {
            timestamp: Date.now(),
            callback
        }
        // 需要操作的数组
        const index = this.queue.indexOf(id)
        if(index !== -1) {
            this.queue.splice(index, 1)
        }
        this.queue.push(id)
        this.timeTask()
    }

    async clear(id) {
        delete this.memory[id]
    }

    async timeTask() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            const {queue} = this
            while(queue.length > 0) {
                const id = queue[0]
                const {data, callback} = this.memory[id]
                callback(data)
                queue.splice(0, 1)
            }
        }, 500)     
    }

    async clearTimer() {

    }
}