import Vue from 'vue'
import Router from 'vue-router'
import TableView from './views/TableView.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: TableView
    },
  ]
})
