import * as moment from 'moment'
import {nSession} from './queue'

export default class Article {
    tableName = 'article'
    queue = []
    mapQueue = {}
    timer = 0
    oldRequestId = 0
    constructor(db) {
        if(!db) {
            throw new Error('缺少better-sqlite3 db对象！')
        }
        this.db = db
    }

    getSimpleList({cateId, content = ''}) {
        return new Promise((resolve, reject) => {
            requestIdleCallback(() => {
                let filters = ''
                if (cateId) {
                    filters += 'article.cate_id=' + cateId + ' AND '
                }
                const stmt = this.db.prepare(`SELECT article_id,title,article.cate_id,article.update_date FROM article
                WHERE ${filters} content LIKE '%${content}%' ORDER BY article.update_date DESC`)
                const data = stmt.all()
                if(content === '') {
                    nSession.setArticlesByCateIds(cateId, data)
                }  
                resolve(data)              
            }, {
                timeout: 3000
            })            
        })
    }

    getList({cateId, content = ''}) {
        return new Promise((resolve, reject) => {
            requestIdleCallback(() => {
                let filters = ''
                if (cateId) {
                    filters += 'article.cate_id=' + cateId + ' AND '
                }
                const stmt = this.db.prepare(`SELECT article_id,title,content,article.cate_id,category.label as cate_label,article.create_date,article.update_date FROM article
                LEFT  OUTER JOIN category ON article.cate_id=category.cate_id WHERE ${filters} content LIKE '%${content}%'`)
                const data = stmt.all()
                resolve(data)              
            }, {
                timeout: 3000
            })            
        })
    }

    add(title = '', content = [], cateId) {
        const datetime = moment().format('YYYY-MM-DD hh:mm:ss')
        return new Promise((resolve, reject) => {
            requestIdleCallback(() => {         
                const stmt = this.db.prepare(`INSERT INTO article (title,content,cate_id,create_date,update_date) VALUES (?, ?, ?, ?, ?)`)
                const info = stmt.run(title, JSON.stringify(content), cateId, datetime, datetime)
                // changes 此操作插入、更新或删除的总行数
                // lastInsertRowid 插入数据库的最后一行的rowid
                resolve(info)              
            }, {
                timeout: 3000
            })            
        })
    }

    // 先读缓存，没有再查数据库
    get(id) {
        return new Promise((resolve, reject) => {
            requestIdleCallback(() => {
                let storage = nSession.getArticle(id)
                if(storage) return resolve(storage)
                const stmt = this.db.prepare(`SELECT article_id,title,content,article.cate_id,category.label as cate_label,article.create_date,article.update_date from article
                LEFT  OUTER JOIN category ON article.cate_id=category.cate_id WHERE article_id=?`)
                const data = stmt.get(id)
                if(data) {
                    data.content = JSON.parse(data.content)
                    nSession.setArticle(id, data)                    
                }
                resolve(data)              
            }, {
                timeout: 3000
            })            
        }) 
    }

    update(id, {title, content, cateId, update_date}) {
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
            requestIdleCallback(() => {
                const stmt = this.db.prepare(`UPDATE article SET ${sqlArr.join(',')} WHERE article_id=@article_id`)
                const info = stmt.run({
                    title, content: JSON.stringify(content) , cate_id: cateId, update_date, article_id: id
                })
                resolve(info)              
            }, {
                timeout: 3000
            })            
        }) 
    }

    // 每次内容更新，先更新缓存，缓存会定时同步到数据库
    async updateAsync({id, data}) {
        if( !id || !data ) return
        if(this.oldRequestId === id) {
            cancelIdleCallback(this.timer)
        }
        this.oldRequestId = id
        const temp = nSession.getArticle(id)
        const update_date = moment().format('YYYY-MM-DD hh:mm:ss')
        const params = {...data, update_date}
        nSession.setArticle(id, {...temp, ...params})
        const update = this.update.bind(this)
        this.timer = requestIdleCallback(() => {
            update(id, params)
        }, {
            timeout: 3000
        })
    }

    del(id) {
        return new Promise((resolve, reject) => {
            requestIdleCallback(() => {
                const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE article_id=?`)
                const info = stmt.run(id)
                nSession.delArticle(id)
                resolve(info)              
            }, {
                timeout: 3000
            })            
        })
    }
}