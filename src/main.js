import 'url-search-params-polyfill';
import Vue from 'vue'
import router from './router';

import VueResource from 'vue-resource'

import App from './App.vue'
import store from './store'

Vue.use(VueResource)

Vue.config.productionTip = false

// make http also available on store instance (FIXME use a service)
store.$http = Vue.http

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
