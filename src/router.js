import Vue from 'vue'
import Router from 'vue-router'
import TableView from './views/TableView.vue'
import AppRuptureCarburant from './views/AppRuptureCarburant.vue'
import AppCarburant from './apps/carburants/AppCarburant.vue'
import AppDvf from './apps/dvf/AppDvf.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: TableView
    },
    {
      path: '/prix-carburants',
      name: 'AppCarburant',
      component: AppCarburant
    },
    /*{
      path: '/rupture-carburants',
      name: 'AppRuptureCarburant',
      component: AppRuptureCarburant
    },*/
    {
      path: '/immobilier',
      name: 'AppDvf',
      component: AppDvf
    }
  ]
})
