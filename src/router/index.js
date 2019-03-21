import Vue from 'vue'
import Router from 'vue-router'
import policy from '@/pages/policy'
import policyClassify from '@/pages/policyClassify'
import selectPerson from '@/pages/selectPerson'
import writeInfo from '@/pages/writeInfo'
import unpaid from '@/pages/policy/unpaid.vue'
Vue.use(Router)

let router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/insurance',
      name: 'policy',
      component: policy
    },{
      path: '/policy',
      name: 'policy',
      component: policy
    },
    {
      path: '/insurance/policyClassify',
      name: 'policyClassify',
      component: policyClassify
    },
    {
      path: '/insurance/selectPerson',
      name: 'selectPerson',
      component: selectPerson
    },
    {
      path: '/insurance/writeInfo',
      name: 'writeInfo',
      component: writeInfo
    },{
      path: '/insurance/unpaid',
      name: 'unpaid',
      component: unpaid
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to,from);
  // console.log('router inner:',from.query.eventID)
  // if (from.query.eventID) {
  //   next({path:to.routes.path,query:{eventID:from.query.eventID}});
  // }

  next();
})
export default router