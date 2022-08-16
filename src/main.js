import 'url-search-params-polyfill';
import Vue from 'vue'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.min.css'

import VueResource from 'vue-resource'

import App from './App.vue'
import store from './store'

Vue.use(Loading)
Vue.use(VueResource)

Vue.config.productionTip = false

// make http also available on store instance (FIXME use a service)
store.$http = Vue.http

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
