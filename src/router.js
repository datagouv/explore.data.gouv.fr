import Vue from 'vue'
import Router from 'vue-router'
import TableView from './views/TableView.vue'
import Dataviz from './views/Dataviz.vue'
import GenerateVizView from './views/GenerateVizView.vue'

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
      path: '/dataviz',
      name: 'dataviz',
      component: Dataviz
    },
    {
      path: '/visualiser',
      name: 'GenerateVizView',
      component: GenerateVizView
    },
  ]
})
