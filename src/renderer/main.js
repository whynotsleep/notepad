import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import contextmenu from "v-contextmenu"
import './assets/css/reset.css'
import "@wangeditor/editor/dist/css/style.css";
import 'element-ui/lib/theme-chalk/index.css'
import "v-contextmenu/dist/index.css"
import App from './App'
import router from './router'
import store from './store'
import db from '../../db/index'
import channel from './utils/channel'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.db = Vue.prototype.$db = db
Vue.channel = Vue.prototype.$channel = channel
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(contextmenu)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
