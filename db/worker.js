const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');
const db = require('./init')

function queryList() {
    const stmt = db.prepare(`SELECT article_id,title,content,article.cate_id,category.label as cate_label,article.create_date,article.update_date FROM article
    LEFT  OUTER JOIN category ON article.cate_id=category.cate_id`)
    const data = stmt.all()
    return data
}

// if (isMainThread) {
//  const worker = new Worker(__filename);

//  parentPort.on('message', (e) => {
//     console.log('主线程接受消息：', e)
//  })
// } else {
//     const data = queryList()
//     parentPort.postMessage(data)
// }

const data = queryList()
parentPort.postMessage(data)