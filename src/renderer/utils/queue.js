export default class Queue {
    events = {}
    constructor() {

    }

    add(name, event) {
        if(!this.events[name]) {
            this.events[name] = []
        }
        if(typeof event !== 'function')return
        this.events[name].push(event)
    }

    has(name) {
        if( !this.events[name] || this.events[name].length === 0 ) return false
        return true
    }

    dispatch(name) {
        const arr = this.events[name] || []
        for(let i=0; i<arr.length; i++) {
            arr[i]()
        }  
    }

    async dispatchPromise(name) {
        const arr = this.events[name] || []
        for(let i=0; i<arr.length; i++) {
            await arr[i]()
        }  
    }

    remove(name, event) {
        if( !this.events[name] || this.events[name].length === 0 ) return
        const arr = this.events[name]
        const index = arr.indexOf(event)
        if(index !== -1) {
            arr.splice(index, 1)
        }
    }
}