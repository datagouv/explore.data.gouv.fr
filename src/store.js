import Vue from 'vue'
import Vuex from 'vuex'

import {csvapiUrl, pageSize} from '@/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rows: [],
    columns: [],
    fields: [],
    filters: [],
    page: 1,
    pageSize: pageSize,
    dataEndpoint: undefined,
    sortBy: undefined,
    sortDesc: undefined,
    totalRows: 0,
    error: undefined,
    hasError: false,
  },
  getters: {
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
      console.error(res)
      commit('setError', {
        error: res.body.error,
        details: res.body.details,
        id: res.body.error_id,
      })
    },
    handleUploadError ({commit}, res) {
      commit('setError', res)
    },
    changePage ({dispatch}) {
      return dispatch('getData')
    },
    sort ({commit, dispatch}, ctx) {
      commit('setSort', {by: ctx.sortBy, desc: ctx.sortDesc})
      return dispatch('getData')
    },
    makeDataUrl ({state}) {
      const offset = pageSize * (state.page - 1)
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
    async getData ({state, commit, dispatch}) {
      const dataUrl = await dispatch('makeDataUrl')
      this.$http.get(dataUrl.toString()).then(res => {
        if (res.body.ok) {
          commit('setRows', res.body.rows)
          if (!state.columns.length) {
            commit('setColumns', res.body.columns)
          }
          commit('setTotalRows', res.body.total)
        } else {
          dispatch('handleError', res)
        }
      }).catch(res => dispatch('handleError', res))
    },
    apify ({commit, dispatch}, url) {
      const apiUrl = new URL(csvapiUrl)
      apiUrl.pathname = '/apify'
      apiUrl.searchParams.set('url', url)
      this.$http.get(apiUrl.toString()).then(res => {
        if (res.body.ok && res.body.endpoint) {
          commit('setDataEndpoint', res.body.endpoint)
          return dispatch('getData')
        } else {
          return dispatch('showError', res)
        }
      }).catch(res => dispatch('handleError', res))
    }
  },
  mutations: {
    setDataEndpoint (state, endpoint) {
      state.dataEndpoint = endpoint
    },
    setRows (state, rows) {
      state.rows = rows
    },
    setPage (state, page) {
      state.page = page
    },
    setColumns (state, columns) {
      state.columns = columns
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
    addFilter (state, filter) {
      state.filters.push(filter)
    },
    deleteFilter (state, index) {
      state.filters.splice(index, 1)
    }
  }
})
