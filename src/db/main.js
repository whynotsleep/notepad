import dbController from './index'

const { ipcRenderer } = require('electron')
let port = null
// 等待队列里面的事件完成再关闭
ipcRenderer.on('provide-worker-channel', async (e) => {
    port = e.ports[0]
    port.onmessage = (req) => {
        if(Object.prototype.toString.call(req.data) === '[object Object]') {
            dbController.distribute(req.data).then(res => {
                port.postMessage(res)
            })
            .catch(err => {
                if(req.reqId) {
                    port.postMessage({reqId: res.reqId, body: {code: 500, data: null, msg: err.message || '查询服务错误'}})
                }
                console.error(err)
            })
        }
    }
})
ipcRenderer.postMessage('request-worker-channel', {name: 12331242})