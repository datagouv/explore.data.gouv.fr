import Vue from 'vue'
import Vuex from 'vuex'

import {csvapiUrl, pageSize} from '@/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rows: [],
    columns: [],
    fields: [],
    page: 1,
    pageSize: pageSize,
    dataEndpoint: undefined,
    sortBy: undefined,
    sortDesc: undefined,
    totalRows: 0,
    loader: undefined,
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
    startLoader ({commit}) {
      commit('startLoader')
    },
    stopLoader ({commit}) {
      commit('stopLoader')
    },
    handleError ({commit, dispatch}, res) {
      console.error(res)
      commit('setError', {
        error: res.body.error,
        details: res.body.details,
        id: res.body.error_id,
      })
      dispatch('stopLoader')
    },
    changePage ({dispatch}) {
      dispatch('startLoader')
      dispatch('getData')
    },
    sort ({commit, dispatch}, ctx) {
      dispatch('startLoader')
      commit('setSort', {by: ctx.sortBy, desc: ctx.sortDesc})
      dispatch('getData')
    },
    getData ({state, commit, dispatch}) {
      const offset = pageSize * (state.page - 1)
      const dataUrl = new URL(state.dataEndpoint)
      dataUrl.searchParams.set('_shape', 'objects')
      dataUrl.searchParams.set('_rowid', 'hide')
      dataUrl.searchParams.set('_size', pageSize)
      dataUrl.searchParams.set('_offset', offset)
      if (state.sortBy) {
        const param = state.sortDesc ? '_sort_desc' : '_sort'
        dataUrl.searchParams.set(param, state.sortBy)
      }
      this.$http.get(dataUrl.toString()).then(res => {
        if (res.body.ok) {
          commit('setRows', res.body.rows)
          if (!state.columns.length) {
            commit('setColumns', res.body.columns)
          }
          if (!state.totalRows) {
            commit('setTotalRows', res.body.total)
          }
          dispatch('stopLoader')
        } else {
          dispatch('handleError', res)
        }
      }).catch(res => dispatch('handleError', res))
    },
    apify ({commit, dispatch}, url) {
      dispatch('startLoader')
      const apiUrl = new URL(csvapiUrl)
      apiUrl.pathname = '/apify'
      apiUrl.searchParams.set('url', url)
      this.$http.get(apiUrl.toString()).then(res => {
        if (res.body.ok && res.body.endpoint) {
          commit('setDataEndpoint', res.body.endpoint)
          dispatch('getData')
        } else {
          dispatch('showError', res)
        }
      }).catch(res => dispatch('handleError', res))
    }
  },
  mutations: {
    setDataEndpoint (state, endpoint) {
      state.dataEndpoint = endpoint
    },
    startLoader (state) {
      state.loader = this.$loading.show()
    },
    stopLoader (state) {
      state.loader.hide()
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
    }
  }
})
