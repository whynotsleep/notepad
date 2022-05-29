const { ipcRenderer } = require('electron')
const db = require('better-sqlite3')('notepad.db', { verbose: undefined})
const fs = require('fs')
const path = require('path')
const install_sql = fs.readFileSync(path.join(__static, '/install.sql'), 'utf8')
db.exec(install_sql);


module.exports = db