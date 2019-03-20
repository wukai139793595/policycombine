// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './insurance.vue'
import router from './router/insurance.js'
import ElementUi from 'element-ui'
import  './util/flexible.js'
import './assets/style/insurance.css'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'vue-moment'
import axios from 'axios'
import Cookie from 'vue-cookie'
Vue.config.productionTip = false

Vue.use(Cookie)
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
// Vue.use(axios)
Vue.use(ElementUi)
Vue.use(moment)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
