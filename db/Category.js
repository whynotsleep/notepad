import * as moment from 'moment'

export default class Category {
    tableName = 'category'
    constructor(db) {
        if(!db) {
            throw new Error('缺少better-sqlite3 db对象！')
        }
        this.db = db
    }

    getList(label = '') {
        const stmt = this.db.prepare(`SELECT cate_id,label,create_date,update_date FROM ${this.tableName} WHERE label LIKE '%${label}%'`)
        return stmt.all()
    }

    add(label) {
        const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
        const stmt = this.db.prepare(`INSERT INTO ${this.tableName} (label,create_date,update_date) VALUES (?, ?, ?)`)
        const info = stmt.run(label, datetime, datetime)
        // changes 此操作插入、更新或删除的总行数
        // lastInsertRowid 插入数据库的最后一行的rowid
        return info
    }

    get(id) {
        const stmt = this.db.prepare(`SELECT cate_id,label,create_date,update_date from ${this.tableName} WHERE cate_id=?`)
        return stmt.get(id)
    }

    getByLabel(label) {
        const stmt = this.db.prepare(`SELECT cate_id,label,create_date,update_date from ${this.tableName} WHERE label=?`)
        return stmt.get(label)
    }

    getSameLabelCount(label) {
        const stmt = this.db.prepare(`SELECT COUNT(*) as count from ${this.tableName} WHERE label=?`)
        return stmt.get(label)
    }

    update(id, label) {
        const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
        const stmt = this.db.prepare(`UPDATE ${this.tableName} SET label=?,update_date=? WHERE cate_id=?`)
        const info = stmt.run(label, datetime, id)
        // changes 此操作插入、更新或删除的总行数
        // lastInsertRowid 插入数据库的最后一行的rowid
        return info
    }

    del(id) {
        const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE cate_id=?`)
        return stmt.run(id)
    }
}