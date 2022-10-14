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
      path: '/test',
      name: 'home',
      component: TableView
    },
    {
      path: '/',
      name: 'map',
      component: MapView
    },
  ]
})
