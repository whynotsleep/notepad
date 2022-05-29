import Article from './Article'
import Category from './Category'
const db = require('better-sqlite3')('notepad.db', { verbose: undefined})
const fs = require('fs')
const path = require('path')
const install_sql = fs.readFileSync(path.join(__static, '/install.sql'), 'utf8')
db.exec(install_sql);

const category = new Category(db)
const article = new Article(db)

class DBController {
    constructor(db) {
        this.db = db
    }

    static getInstance() {
        if(!DBController.instance) {
            DBController.instance = new DBController(db)
        }
        return DBController.instance
    }

    query(path) {
        switch(path) {
            case 'article':
                return article.query.bind(article)
            case 'category':
                return category.query.bind(category)
            default:
                return
        }
    }

    async distribute({reqId, path, params} = {}) {
        if(!reqId || !path) return
        try {
            let [main, sub] = (path || '').replace(/^\//, '').split('/')
            let fn = await this.query(main)
            if(fn) {
                let body = await fn(sub, params)
                return {
                    reqId,
                    body
                }
            } else {
                return {reqId, body: {code: 404, data: null, msg: '找不到该方法'}}
            }
        } catch(err) {
            console.error(err)
        } 
        return {reqId, body: {code: 500, data: null, msg: '请求解析错误'}}
    }
}

export default DBController.getInstance()