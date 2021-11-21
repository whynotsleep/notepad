import * as moment from 'moment'
import Queue from './queue'
const updateQueue = new Queue()
export default class Article {
    tableName = 'article'
    queue = []
    mapQueue = {}
    timer = 0
    constructor(db) {
        if(!db) {
            throw new Error('缺少better-sqlite3 db对象！')
        }
        this.db = db
    }

    getSimpleList({cateId, content = ''}) {
        let filters = ''
        if (cateId) {
            filters += 'article.cate_id=' + cateId + ' AND '
        }
        const stmt = this.db.prepare(`SELECT article_id,title,article.cate_id,article.update_date FROM article
         WHERE ${filters} content LIKE '%${content}%' ORDER BY article.update_date DESC`)
        return stmt.all()
    }

    getList({cateId, content = ''}) {
        let filters = ''
        if (cateId) {
            filters += 'article.cate_id=' + cateId + ' AND '
        }
        const stmt = this.db.prepare(`SELECT article_id,title,content,article.cate_id,category.label as cate_label,article.create_date,article.update_date FROM article
        LEFT  OUTER JOIN category ON article.cate_id=category.cate_id WHERE ${filters} content LIKE '%${content}%'`)
        return stmt.all()
    }

    add(title = '', content = '', cateId) {
        const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
        const stmt = this.db.prepare(`INSERT INTO article (title,content,cate_id,create_date,update_date) VALUES (?, ?, ?, ?, ?)`)
        const info = stmt.run(title, content, cateId, datetime, datetime)
        // changes 此操作插入、更新或删除的总行数
        // lastInsertRowid 插入数据库的最后一行的rowid
        return info
    }

    // 先读缓存，没有再查数据库
    get(id) {
        if ( this.mapQueue[id] ) return this.mapQueue[id].data
        const stmt = this.db.prepare(`SELECT article_id,title,content,article.cate_id,category.label as cate_label,article.create_date,article.update_date from article
        LEFT  OUTER JOIN category ON article.cate_id=category.cate_id WHERE article_id=?`)
        return stmt.get(id)
    }

    update({id, title, content, cateId}) {
        // console.log('更新内容 ', id, ': ', content)
        const sqlArr = []

        if (title) {
            sqlArr.push('title=@title')
        }
        if (content) {
            sqlArr.push('content=@content')
        }
        if (cateId) {
            sqlArr.push('cate_id=@cate_id')
        }
        if(sqlArr.length <= 0) {
            return
        }

        sqlArr.push('update_date=@update_date')
        const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
        const stmt = this.db.prepare(`UPDATE article SET ${sqlArr.join(',')} WHERE article_id=@article_id`)
        const info = stmt.run({
            title, content, cate_id: cateId, update_date: datetime, article_id: id
        })
        // changes 此操作插入、更新或删除的总行数
        // lastInsertRowid 插入数据库的最后一行的rowid
        return info
    }

    // 每次内容更新，先更新缓存，缓存会定时同步到数据库
    async updateAsync(data) {
        if( !data || !data.id ) return
        updateQueue.push(data.id, data, this.update.bind(this))
    }

    del(id) {
        const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE article_id=?`)
        return stmt.run(id)
    }
}