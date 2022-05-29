import { app, BrowserWindow, Menu, globalShortcut, ipcMain } from 'electron'
const path = require('path')
const { MessageChannelMain } = require('electron')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow,dbWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
const dbURL = process.env.NODE_ENV === 'development'
? `http://localhost:9080/db.html`
: `file://${__dirname}/db.html`
// 主窗口
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    // backgroundColor: '0x0f0f00',
    frame: false, //隐藏标题栏
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true, //允许web worker
    }
  })
  Menu.setApplicationMenu(null)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    dbWindow = null
    app.exit()
  })
  // 刷新页面
  globalShortcut.register('F5', () => {
    mainWindow.webContents.send('refresh')
  })
  // 打开开发者工具
  globalShortcut.register('F12', () => {
    mainWindow.openDevTools()
  })
}

ipcMain.on('render-event',(event, arg) => {
  if (arg === 'max') {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  } else if (arg === 'min') {
    mainWindow.minimize()
  } else if (arg === 'close') {
    mainWindow.webContents.send('close')
  }
})

ipcMain.on('close',(event, arg) => {
  mainWindow.close()
})
ipcMain.on('refresh',(event, arg) => {
  mainWindow.reload()
})
ipcMain.on('port',(event, arg) => {
  const ports = event.ports
  ports[0].postMessage('ahdasfasdf dsf ')
})



// 读写窗口
function createDb() {
  dbWindow = new BrowserWindow({
    // width: 200,
    // height: 200,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true, //允许web worker
    }
  })
  dbWindow.loadURL(dbURL)
  dbWindow.on('closed', () => {
    dbWindow = null
  })
}


app.on('ready', function() {
  createDb()
  createWindow()
  ipcMain.on('request-worker-channel', (event, arg) => {
    console.log('主进程接受消息：', arg)
    let ports = new MessageChannelMain()
    mainWindow.webContents.postMessage('provide-worker-channel', null, [ports.port1])
    dbWindow.webContents.postMessage('provide-worker-channel', null, [ports.port2])
  })
  // console.log('dbWindow.id', dbWindow.id)
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('渲染完mainWindow')
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  // globalShortcut.unregister('F12')
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})