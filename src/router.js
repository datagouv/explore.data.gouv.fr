import Vue from 'vue'
import Router from 'vue-router'
import TableView from './views/TableView.vue'
import AppCarburant from './apps/carburants/AppCarburant.vue'
import AppDvf from './apps/dvf/AppDvf.vue'
import Resource from './views/Resource.vue'

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
    {
      path: '/immobilier',
      name: 'AppDvf',
      component: AppDvf
    },
    {
      path: '/resources/:id/',
      name: 'Resource',
      component: Resource
    }
  ]
})
