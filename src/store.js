import Vue from 'vue'
import Vuex from 'vuex'

import {csvapiUrl, pageSize} from '@/config'

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
    rows: [],
    valuesx: [],
    valuesy: [],
    columns: [],
    displayChart: false,
    generalInfos: {},
    columnsInfos: {},
    colorsCat: {},
    fields: [],
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
    }
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
      return dispatch('getData', 'sort')
    },
    makeDataUrl ({state}, action) {
      let offset
      if (action && action == 'page') {
        offset = pageSize * (state.page - 1)
      }
      else {
        offset = 0
        state.page = 1
      }
      const dataUrl = new URL(state.dataEndpoint)
      dataUrl.searchParams.set('_shape', 'objects')
      dataUrl.searchParams.set('_rowid', 'hide')
      dataUrl.searchParams.set('_size', pageSize)
      dataUrl.searchParams.set('_offset', offset)
      state.filters.forEach(({field, value, comp}) => {
        dataUrl.searchParams.set(`${field}__${comp}`, value)
      })
      if (state.sortBy) {
        const param = state.sortDesc ? '_sort_desc' : '_sort'
        dataUrl.searchParams.set(param, state.sortBy)
      }
      return dataUrl
    },
    async getData ({state, commit, dispatch}, action) {
      const dataUrl = await dispatch('makeDataUrl', action)
      this.$http.get(dataUrl.toString()).then(res => {
        if (res.body.ok) {
          if(action == 'page') {
            commit('setRows', state.rows.concat(res.body.rows))
          } else {
            commit('setRows', res.body.rows)
          }
          if (!state.columns.length) {
            commit('setColumns', res.body.columns)
          }
          commit('setTotalRows', res.body.total)
          commit('setGeneralInfos', res.body.general_infos)
          commit('setColumnsInfos', res.body.columns_infos)
        } else {
          dispatch('handleError', res)
        }
      }).catch(res => dispatch('handleError', res))
    },
    graphdata({state, commit, dispatch}, viz){
      const dataUrl = new URL(state.dataEndpoint)
      console.log(dataUrl)
      dataUrl.searchParams.set('_viz', 'yes')
      dataUrl.searchParams.set('viz_axis_x', viz.x)
      dataUrl.searchParams.set('viz_op', viz.op)
      if (viz.y != '') {
        dataUrl.searchParams.set('viz_axis_y', viz.y)
      }
      if (viz.xtop != '') {
        dataUrl.searchParams.set('viz_axis_x_top', viz.xtop)
      }
      if (viz.xgb != ''){
        dataUrl.searchParams.set('viz_axis_x_substring', viz.xgb)
      }
      viz.filters.forEach((item) => {
        dataUrl.searchParams.set(`${item.column}__${item.operation}`, item.value)
      })
      console.log(dataUrl)
      this.$http.get(dataUrl.toString()).then(res => {
        if (res.body.ok) {
          commit('setValuesX', res.body.resx)
          commit('setValuesY', res.body.resy)
          commit('setDisplayChart', true)
        }
      }).catch(res => dispatch('handleError', res))
    },
    deleteChart({state, commit, dispatch}){
      commit('setDisplayChart', false)
    },
    apify ({commit, dispatch}, url) {
      const apiUrl = new URL(csvapiUrl)
      apiUrl.pathname = '/apify'
      apiUrl.searchParams.set('url', encodeURI(url))
      apiUrl.searchParams.set('analysis', 'yes')
      return this.$http.get(apiUrl.toString()).then(res => {
        if (res.body.ok && res.body.endpoint) {
          console.log(res.body.ok)
          commit('setEndpoints', res.body)
          commit('updateLoadingState', true)
          return dispatch('getData', 'apify')
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
      // Patch waiting csvapi in prod
      state.dataEndpoint = csvapiUrl + '/' + data.endpoint.split('/').slice(3).join('/')
      //state.dataEndpoint = data.endpoint
      state.profileEndpoint = data.profile_endpoint
    },
    setRows (state, rows) {
      state.rows = rows
    },
    setValuesX (state, values) {
      state.valuesx = values
    },
    setValuesY (state, values) {
      state.valuesy = values
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
            };
          }
          state.colorsCat[column] = colorCat;
        }
      }
    },
    setPage (state, page) {
      state.page = page
    },
    setColumns (state, columns) {
      state.columns = columns
    },
    setDisplayChart (state, val) {
      state.displayChart = val
    },
    setTotalRows (state, totalRows) {
      state.totalRows = totalRows
    },
    setError (state, error) {
      state.error = error
      state.hasError = true
    },
    setSort (state, sort) {
      state.sortBy = sort.by
      state.sortDesc = sort.desc
    },
    setDgvInfos (state, data) {
      state.dgv_infos.resource = data.resource
      state.dgv_infos.dataset_id = data.dataset_id
      state.dgv_infos.dataset_title = data.dataset_title
      state.dgv_infos.organization_id = data.organization_id
      state.dgv_infos.organization_name = data.organization_name
      state.dgv_infos.other_resources = data.other_resources
    },
    addFilter (state, filter) {
      state.filters.push(filter)
    },
    deleteFilter (state, index) {
      state.filters.splice(index, 1)
    },
    deleteAllFiltersWithField (state, field) {
      state.filters = state.filters.filter((obj) => {
          return obj.field !== field;
      });
    }
  }
})
