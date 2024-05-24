import 'url-search-params-polyfill'
import Vue from 'vue'
import Meta from 'vue-meta';
import router from './router'
import VueResource from 'vue-resource'
import "@gouvfr/dsfr/dist/dsfr/dsfr.module"



import App from './App.vue'
import matomo from './matomo'  // needed to load matomo scripts
import i18n from './i18n'

Vue.use(VueResource)
Vue.use(Meta)

Vue.config.productionTip = false

// make http also available on store instance (FIXME use a service)

new Vue({
  router,
  render: h => h(App),
  i18n,
}).$mount('#app')
