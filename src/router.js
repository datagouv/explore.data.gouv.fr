import Vue from 'vue'
import Router from 'vue-router'
import ExploreTableView from './views/ExploreTableView.vue'
import AppCarburant from './apps/carburants/AppCarburant.vue'
import AppDvf from './apps/dvf/AppDvf.vue'
import HomePage from './views/HomePage.vue'
import DatasetView from './apps/tabular/DatasetView.vue'
import AppInclusion from './apps/inclusion/AppInclusion.vue'
import ResourceView from './apps/tabular/ResourceView.vue'
import i18n from './i18n'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:lang',
      component: {
        render: h => h('router-view')
      },
      children: [
        {
          path: '',
          name: 'home',
          component: HomePage
        },
        {
          path: 'tableau',
          name: 'tableau',
          component: ExploreTableView
        },
        {
          path: 'prix-carburants',
          name: 'prix-carburants',
          component: AppCarburant
        },
        {
          path: 'immobilier',
          name: 'immobilier',
          component: AppDvf
        },
        {
          path: 'datasets/:id',
          name: 'datasets',
          component: DatasetView
        },    
        {
          path: 'resources/:id',
          name: 'resources',
          component: DatasetView
        },    
        {
          path: 'inclusion',
          name: 'inclusion',
          component: AppInclusion
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const lang = to.params.lang;
  if (!['en', 'fr'].includes(lang)) {
    if (to.path.startsWith('/immobilier')){
      return next({ name: 'immobilier', params: { lang: 'fr' }, query: to.query});
    }
    else if (to.path.startsWith('/prix-carburants')){
      return next({ name: 'prix-carburants', params: { lang: 'fr' }, query: to.query});
    }
    else if (to.path.startsWith('/tableau')){
      return next({ name: 'tableau', params: { lang: 'fr' }, query: to.query});
    }
    else {
      return next('fr/');
    }
  }

  if (i18n.locale !== lang) {
    i18n.locale = lang;
  }

  return next();
});

export default router;