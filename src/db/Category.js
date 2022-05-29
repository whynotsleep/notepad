import * as moment from 'moment'
import Request from './request'
export default class Category extends Request {
    tableName = 'category'
    constructor(db) {
        super()
        if(!db) {
            throw new Error('缺少better-sqlite3 db对象！')
        }
        this.db = db
    }

    getList({label = ''}) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`SELECT cate_id,label,create_date,update_date FROM ${this.tableName} WHERE label LIKE '%${label}%' ORDER BY update_date DESC`)
            const data = stmt.all()
            resolve({code: 0, msg: '', data})
        })
    }

    add({label}) {
        return new Promise((resolve, reject) => {
            const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
            const stmt = this.db.prepare(`INSERT INTO ${this.tableName} (label,create_date,update_date) VALUES (?, ?, ?)`)
            const data = stmt.run(label, datetime, datetime)
            // changes 此操作插入、更新或删除的总行数
            // lastInsertRowid 插入数据库的最后一行的rowid
            resolve({code: 0, msg: '', data})
        })
    }

    get({id}) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`SELECT cate_id,label,create_date,update_date from ${this.tableName} WHERE cate_id=?`)
            const  data =  stmt.get(id)
            resolve({code: 0, msg: '', data})
        })
    }

    getByLabel({label}) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`SELECT cate_id,label,create_date,update_date from ${this.tableName} WHERE label=?`)
            const data = stmt.get(label)
            resolve({code: 0, msg: '', data})
        })
    }

    getSameLabelCount({label}) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`SELECT COUNT(*) as count from ${this.tableName} WHERE label=?`)
            const data = stmt.get(label)
            resolve({code: 0, msg: '', data})
        })
    }

    update({id, label}) {
        return new Promise((resolve, reject) => {
            const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
            const stmt = this.db.prepare(`UPDATE ${this.tableName} SET label=?,update_date=? WHERE cate_id=?`)
            const data = stmt.run(label, datetime, id)
            // changes 此操作插入、更新或删除的总行数
            // lastInsertRowid 插入数据库的最后一行的rowid
            resolve({code: 0, msg: '', data})
        })
    }

    del({id}) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE cate_id=?`)
            const data = stmt.run(id)
            resolve({code: 0, msg: '', data})
        })
    }
}