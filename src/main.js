import 'url-search-params-polyfill';
import Vue from 'vue'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.min.css'

import VueResource from 'vue-resource'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import store from './store'

Vue.use(Loading)
Vue.use(VueResource)
Vue.use(BootstrapVue)

Vue.config.productionTip = false

// make loading and http also available on store instance
store.$loading = Vue.$loading
store.$http = Vue.http

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
