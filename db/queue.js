// 需要解决的问题：连续写入数据库会非常卡顿，需要有一个管理写入的方法，同一篇文章在短时间内多次写入，只写入最后一次，同时缓存写入的内容
// 
// 设计原理
// 
export default class Queue {
    memory = {}
    queue = []

    constructor() {

    }

    async push(id, data, callback) {
        // 缓存
        this.memory[id] = {
            timestamp: Date.now(),
            data,
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
                console.log('更新了ID：', id)
                callback(data)
                queue.splice(0, 1)
            }
        }, 500)     
    }

    async clearTimer() {

    }
}