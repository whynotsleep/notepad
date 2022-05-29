const {
    shell,
    ipcRenderer
} = require('electron');
import { createUuid } from './uuid'


class Request {
    port = null
    reqMap = new Map()
    queue = []
    constructor() {
        this.init()
    }

    init() {
        ipcRenderer.on('provide-worker-channel', async (e) => {
            this.port = e.ports[0]
            this.port.onmessage = (res) => {
                const {reqId, body} = res.data
                if(reqId && this.reqMap.has(reqId)) {
                    const [resolve, reject] = this.reqMap.get(reqId)
                    this.reqMap.delete(reqId)
                    if(body) {
                        resolve(body)
                    } else {
                        reject()
                    }
                }
            }
            while(this.queue.length > 0) {
                const send = this.queue.shift()
                send()
            }
        })
        ipcRenderer.postMessage('request-worker-channel', 1)        
        return this
    }

    query(path, params) {
        if(!path) return
        return new Promise((resolve, reject) => {
            const reqId = createUuid()
            const req = {
                reqId,
                path,
                params
            }
            const send = () => {
                this.port.postMessage(req)
                this.reqMap.set(reqId, [resolve, reject])                   
            }
            if(!this.port) {
                this.queue.push(send)
            } else {
                send()
            }
        })
    }
}
const fetch = new Request()
export default fetch.query.bind(fetch)