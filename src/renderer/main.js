import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import './assets/css/reset.css'
import "@wangeditor/editor/dist/css/style.css";
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import db from '../../db/index'
import channel from './utils/channel'
import Queue from './utils/queue'
const { shell, ipcRenderer } = require('electron');
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.db = Vue.prototype.$db = db
Vue.channel = Vue.prototype.$channel = channel
const queue = new Queue()
Vue.queue = Vue.prototype.$queue = queue
Vue.config.productionTip = false

window.open = function(...arg) {
  shell.openExternal(...arg)
}
// 等待队列里面的事件完成再关闭
ipcRenderer.on('close', async (event) => {
  await queue.dispatchPromise('close')
  ipcRenderer.send('close', true)
})
// 等待队列里面的事件完成再刷新
ipcRenderer.on('refresh', async (event) => {
  await queue.dispatchPromise('close')
  ipcRenderer.send('refresh', true)
})

Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
