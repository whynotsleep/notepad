import Article from './Article'
import Category from './Category'
const db = require('better-sqlite3')('notepad.db', { verbose: console.log })
const fs = require('fs')
const path = require('path')
const install_sql = fs.readFileSync(path.join(__static, '/install.sql'), 'utf8')
db.exec(install_sql);

class DBController {
    constructor(db) {
        this.db = db

        this.category = new Category(db)
        this.article = new Article(db)
    }

    static getInstance() {
        if(!DBController.instance) {
            DBController.instance = new DBController(db)
        }
        return DBController.instance
    }
}

export default DBController.getInstance()