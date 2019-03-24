// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import ElementUi from 'element-ui'
import  './util/flexible.js'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/style/util.css'
// import '@/assets/style/index.css'
import moment from 'vue-moment'
import Cookie from 'vue-cookie'
Vue.config.productionTip = false

Vue.use(ElementUi)
Vue.use(moment)
Vue.use(Cookie)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
