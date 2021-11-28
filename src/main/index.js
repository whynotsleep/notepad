import { app, BrowserWindow, Menu, globalShortcut, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

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
  })
  // mainWindow.webContents.send('distributeIds',{
  //   mainWindow : mainWindow.id
  // });
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

app.on('ready', function() {
  createWindow()
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
