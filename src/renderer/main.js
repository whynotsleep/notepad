import Vue from 'vue'
import ElementUI from 'element-ui'
import './assets/css/reset.css'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import 'highlight.js/styles/monokai-sublime.css'
import 'element-ui/lib/theme-chalk/index.css';
import 'animate.css';
import './assets/css/index.scss'
import App from './App'
import router from './router'
import store from './store'
import Queue from './utils/queue'
import fetch from './utils/request';

const { shell, ipcRenderer } = require('electron');
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
const queue = new Queue()
Vue.config.productionTip = false
Vue.fetch = Vue.prototype.$fetch = fetch

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
