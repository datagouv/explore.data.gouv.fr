import Vue from 'vue'
import Router from 'vue-router'
import TableView from './views/TableView.vue'
import MapView from './views/MapView.vue'

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
      name: 'map',
      component: MapView
    },
  ]
})
