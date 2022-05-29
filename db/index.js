import Article from './Article'
import Category from './Category'
const { ipcRenderer } = require('electron')
const db = require('better-sqlite3')('notepad.db', { verbose: undefined})
const fs = require('fs')
const path = require('path')
const install_sql = fs.readFileSync(path.join(__static, '/install.sql'), 'utf8')
db.exec(install_sql);
let mainWinId
// ipcRenderer.on('distributeIds', async (event) => {
//     mainWinId = event.mainWinId
//   console.log('顶顶顶顶distributeIds: ', event)
// })
// ipcRenderer.send('request-worker-channel', 2)
// let channel 
// ipcRenderer.on('provide-worker-channel', (e) => {
//     channel = e.ports[0]
//     console.log('数据库进程：', e)
//     channel.message = (messageEvent) => {
//       console.log('数据库进程接受到消息：', messageEvent.data)
//       channel.postMessage('hahahah')
//     }
//     // channel.on('message', (event) => {
//     //     console.log('数据库进程接受到消息：', event.data)
//     //     channel.postMessage('hahahah')
//     //   })
// })
ipcRenderer.on('port2', (e) => {
    console.log('port页面内before', e)
    const port = e.ports[0]
    port.onmessage = (messageEvent) => {
        console.log('port收到消息', messageEvent.data)
    }
    
    console.log('port开始发送', e)
    port.postMessage('广泛大概豆腐干的法国队法国')
})
ipcRenderer.on('test', async (e) => {
    console.log('test页面内before', e)
    const port = e.ports[0]
    // port.onmessage = (messageEvent) => {
    //     console.log('port收到消息', messageEvent.data)
    // }

    console.log('port开始发送', e)
    port.postMessage('发发发发打发十分是')
})

console.log('再转发')
class DBController {
    constructor(db) {
        this.db = db

        this.category = new Category(db, this.postMessage)
        this.article = new Article(db, this.postMessage)
    }

    static getInstance() {
        if(!DBController.instance) {
            DBController.instance = new DBController(db)
        }
        return DBController.instance
    }

    onmessage(message) {
        console.log(message)
    }

    postMessage(data) {
        channel && channel.postMessage(data)
    }
}

DBController.getInstance()

// export default DBController.getInstance()