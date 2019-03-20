import Vue from 'vue'
import Router from 'vue-router'
import insurance from '@/pages/insurance'
import search from '@/pages/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'insurance',
      component: insurance
    },{
      path: '/search',
      name: 'search',
      component: search
    },

  ]
})
