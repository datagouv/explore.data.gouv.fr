import Vue from 'vue'
import Vuex from 'vuex'

import {csvapiUrl, pageSize} from '@/config'
import { apify, configure, getData } from './csvapi'

Vue.use(Vuex)

function getColor(col, value, colors) {
  let catnb = 0
  if(colors[col] && colors[col][value]) {
    catnb = colors[col][value]
  }
  return catnb
}

export default new Vuex.Store({
  state: {
    /** @type {Array} */
    rows: [],
    columns: [],
    generalInfos: {},
    columnsInfos: {},
    colorsCat: {},
    fields: [],
    /** @type {Array<import('./csvapi').CsvapiFilter>} */
    filters: [],
    page: 1,
    pageSize: pageSize,
    dataEndpoint: undefined,
    profileEndpoint: undefined,
    sortBy: undefined,
    sortDesc: undefined,
    totalRows: 0,
    error: undefined,
    hasError: false,
    dgv_infos: {
      resource: undefined,
      dataset_id: undefined,
      dataset_title: undefined,
      organization_id: undefined,
      organization_name: undefined,
      other_resources: [],
    },
    hasLoaded: false,
  },
  getters: {
    color (state) {
      return (col, value) => getColor(col, value,state.colorsCat)
    },
    fields (state) {
      return state.columns.map(c => {
        return {
          key: c,
          label: c,
          sortable: true,
        }
      })
    },
  },
  actions: {
    handleError ({commit}, res) {
      commit('setError', {
        error: res.body.error,
        details: res.body.details,
        id: res.body.error_id,
      })
    },
    changePage ({dispatch, state}) {
      if((state.page - 1) <= state.totalRows / state.pageSize) {
        return dispatch('getData', 'page')
      }
    },
    sort ({commit, dispatch}, ctx) {
      commit('setSort', {by: ctx.sortBy, desc: ctx.sortDesc})
      return dispatch("getData", "sort")
    },
    getData({commit, dispatch, state}, action) {
      return getData(action).then(response => {
        if (response.ok) {
          if(action == 'page') {
            commit('setRows', state.rows.concat(response.rows))
          } else {
            commit('setRows', response.rows)
            commit('setPage', 1)
          }
          if (!state.columns.length) {
            commit('setColumns', response.columns)
          }
          commit('setTotalRows', response.total)
          commit('setGeneralInfos', response.general_infos)
          commit('setColumnsInfos', response.columns_infos)
        } else {
          dispatch('handleError', response)
        }
      }).catch(res => dispatch('handleError', res))
    },
    apify ({commit, dispatch}, url) {
      configure({csvapiUrl})
      return apify(url).then(res => {
        if (res.ok && res.endpoint) {
          commit('setEndpoints', res)
          commit('updateLoadingState', true)
          return dispatch("getData", "apify")
        } else {
          commit('updateLoadingState', true)
          return dispatch('showError', res)
        }
      }).catch(res => dispatch('handleError', res))
    }
  },
  mutations: {
    updateLoadingState(state, data) {
      state.hasLoaded = data
    },
    setEndpoints (state, data) {
      configure({dataEndpoint: data.endpoint})
      state.dataEndpoint = data.endpoint
      state.profileEndpoint = data.profile_endpoint
    },
    setRows (state, rows) {
      state.rows = rows
    },
    setGeneralInfos (state, generalInfos) {
      state.generalInfos = generalInfos
    },
    setColumnsInfos (state, columnsInfos) {
      state.columnsInfos = columnsInfos
      for (let column in columnsInfos) {
        let infos = columnsInfos[column]
        if(infos.categorical_infos) {
          const colorCat = {}
          let cpt = 0
          if (Array.isArray(infos.categorical_infos)) {
            for (let category of infos.categorical_infos) {
              if(category.value) {
                cpt = cpt + 1
                colorCat[category.value] = cpt
              }
            }
          }
          state.colorsCat[column] = colorCat
        }
      }
    },
    setPage (state, page) {
      configure({page})
      state.page = page
    },
    setColumns (state, columns) {
      state.columns = columns
    },
    setTotalRows (state, totalRows) {
      configure({totalRows})
      state.totalRows = totalRows
    },
    setError (state, error) {
      state.error = error
      state.hasError = true
    },
    setSort (state, sort) {
      configure({sortBy: sort.by, sortDesc: sort.desc})
      state.sortBy = sort.by
      state.sortDesc = sort.desc
    },
    setDgvInfos (state, data) {
      state.dgv_infos.resource = data.resource
      state.dgv_infos.dataset_id = data.dataset_id
      state.dgv_infos.dataset_title = data.dataset_title
      state.dgv_infos.organization_id = data.organization_id
      state.dgv_infos.organization_name = data.organization_name
      state.dgv_infos.other_resources = data.other_resources.filter(res => (res.format.includes('csv') | res.format.includes('xls')))
    },
    addFilter (state, filter) {
      console.log("coucou")
      state.filters.push(filter)
      configure({filters: state.filters})
    },
    deleteFilter (state, index) {
      state.filters.splice(index, 1)
      configure({filters: state.filters})
    },
    deleteAllFiltersWithField (state, field) {
      state.filters = state.filters.filter((obj) => {
          return obj.field !== field
      })
      configure({filters: state.filters})
    }
  }
})
