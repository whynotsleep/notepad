import * as moment from 'moment'
import Request from './request'

export default class Article extends Request {
    tableName = 'article'
    timer = 0
    constructor(db) {
        super()
        if(!db) {
            throw new Error('缺少better-sqlite3 db对象！')
        }
        this.db = db
    }

    getSimpleList({cateId, content = ''}) {
        return new Promise((resolve, reject) => {
            let filters = ''
            if (cateId) {
                filters += 'article.cate_id=' + cateId + ' AND '
            }
            const stmt = this.db.prepare(`SELECT article_id,title,article.cate_id,article.update_date FROM article
            WHERE ${filters} content LIKE '%${content}%' ORDER BY article.update_date DESC`)
            const data = stmt.all()
            resolve({code: 0, msg: '', data})
        })
    }

    getList({cateId, content = ''}) {
        return new Promise((resolve, reject) => {
            let filters = ''
            if (cateId) {
                filters += 'article.cate_id=' + cateId + ' AND '
            }
            const stmt = this.db.prepare(`SELECT article_id,title,content,article.cate_id,category.label as cate_label,article.create_date,article.update_date FROM article
            LEFT  OUTER JOIN category ON article.cate_id=category.cate_id WHERE ${filters} content LIKE '%${content}%' ORDER BY article.update_date DESC`)
            const data = stmt.all()
            resolve({code: 0, msg: '', data})
        })
    }

    add({title = '', content = [], cateId}) {
        return new Promise((resolve, reject) => {
            const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
            const stmt = this.db.prepare(`INSERT INTO article (title,content,cate_id,create_date,update_date) VALUES (?, ?, ?, ?, ?)`)
            const data = stmt.run(title, content, cateId, datetime, datetime)
            // changes 此操作插入、更新或删除的总行数
            // lastInsertRowid 插入数据库的最后一行的rowid
            resolve({code: 0, msg: '', data})
        })
    }

    // 先读缓存，没有再查数据库
    get({article_id}) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`SELECT article_id,title,content,article.cate_id,category.label as cate_label,article.create_date,article.update_date from article
            LEFT  OUTER JOIN category ON article.cate_id=category.cate_id WHERE article_id=?`)
            const data = stmt.get(article_id)
            resolve({code: 0, msg: '', data})
        }) 
    }

    update({article_id, title, content, cateId, update_date}) {
        const sqlArr = []

        if (title !== undefined) {
            sqlArr.push('title=@title')
        }
        if (content !== undefined) {
            sqlArr.push('content=@content')
        }
        if (cateId !== undefined) {
            sqlArr.push('cate_id=@cate_id')
        }
        if(sqlArr.length <= 0) {
            return
        }
        const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
        if(!update_date) {
            update_date = datetime
        }
        sqlArr.push('update_date=@update_date')
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`UPDATE article SET ${sqlArr.join(',')} WHERE article_id=@article_id`)
            const data = stmt.run({
                title, content, cate_id: cateId, update_date, article_id: article_id
            })
            resolve({code: 0, msg: '', data})
        }) 
    }

    // 每次内容更新，先更新缓存，缓存会定时同步到数据库
    async updateAsync({article_id, data}) {
        if( !article_id || !data ) return
        const update_date = moment().format('YYYY-MM-DD hh:mm:ss')
        const params = {...data, update_date}
        const update = this.update.bind(this)
        update(article_id, params)
    }

    del({article_id}) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE article_id=?`)
            const data = stmt.run(article_id)
            resolve({code: 0, msg: '', data})
        })
    }
}