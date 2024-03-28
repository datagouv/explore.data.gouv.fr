import Vue from 'vue'
import Vuex from 'vuex'

import {csvapiUrl, pageSize} from '@/config'
import { configure, getData, makeDataUrl } from '@/csvapi'

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
    tabId: "data",
    columns: [],
    generalInfos: {},
    columnsInfos: [],
    colorsCat: {},
    fields: [],
    /** @type {Array<import('@/csvapi').CsvapiFilter>} */
    filters: [],
    page: 1,
    pageSize: 20,
    nextRowsUrl: null,
    sortBy: undefined,
    sortDesc: undefined,    
    totalRows: undefined,
    dataEndpoint: undefined,
    profileEndpoint: undefined,
    page: 1,
    dgv_infos: {
      resource: undefined,
      dataset_id: undefined,
      dataset_title: undefined,
      organization_id: undefined,
      organization_name: undefined,
      other_resources: [],
    },
  },
  getters: {
    color(state) {
      return (col, value) => getColor(col, value, state.colorsCat)
    },
    fields(state) {
      if (state.columns) {
        return state.columns.map(c => {
          return {
            key: c,
            label: c,
            sortable: true,
          }
        })
      } else {
        return
      }
    },
  },
  actions: {
    handleError ({ commit }, res) {
      commit('setError', {
        error: res.body.error,
        details: res.body.details,
        id: res.body.error_id,
      })
    },
    changePage({ commit, dispatch, state }) {
      if (state.nextRowsUrl) {
        fetch(state.nextRowsUrl).then((response) => {
          return response.json()
        }).then((data) => {
          commit('setRows', state.rows.concat(data.data))
          commit('setNextRowsUrl', data["links"].next)
        })
      }
    },
    filterPage({ commit, dispatch, state }) {
      dispatch('retrieveData')
    },
    sort({ commit, dispatch, state }, ctx) {
      commit('setSort', { by: ctx.sortBy, desc: ctx.sortDesc })
      dispatch('retrieveData')
    },
    getProfile({ commit, dispatch, state }) {
      const apiProfileUrl = new URL(process.env.VUE_APP_TABULAR_API + "/api/resources/" + state.dgv_infos.resource.id + "/profile/")
      let apiProfile = null
      // fetch profile
      fetch(apiProfileUrl.toString()).then(response2 => {
        return response2.json()
      })
        .then((profile) => {

          commit('setProfile', profile.profile)
          commit(
            "setColumns",
            profile.profile.header.map((c) => {
              return c.replaceAll('"', "");
            })
          );
          let obj = {};
          obj = {};
          for (const [key, value] of Object.entries(profile.profile.columns)) {
            let subobj = {};
            subobj = { ...value, ...profile.profile.profile[key] };
            obj[key] = subobj;
          }
          commit("setColumnsInfos", obj);
        })
    },
    retrieveData({ commit, dispatch, state }) {
      commit(
        'setEndpoints',
        {
          "endpoint": process.env.VUE_APP_TABULAR_API + "/api/resources/" + state.dgv_infos.resource.id + "/data/",
          "profile_endpoint": process.env.VUE_APP_TABULAR_API + "/api/resources/" + state.dgv_infos.resource.id + "/profile/"
        }
      )
      const dataUrl = new URL(process.env.VUE_APP_TABULAR_API + "/api/resources/" + state.dgv_infos.resource.id + "/data/")
      dataUrl.searchParams.set('page_size', state.pageSize.toString())
      dataUrl.searchParams.set('page', 1)
      state.filters.forEach(({ field, value, comp }) => {
        dataUrl.searchParams.set(`${field}__${comp}`, value)
      })
      if (state.sortBy) {
        const valSort = state.sortDesc ? 'asc' : 'desc'
        dataUrl.searchParams.set(state.sortBy + '__sort', valSort)
      }
      fetch(dataUrl).then((response) => {
        return response.json()
      }).then((data) => {
        commit('setRows', data.data)
        commit('setNextRowsUrl', data["links"].next)
        commit('setTotalRows', data["meta"].total)
      })
    },
    manageDgvInfos({ commit, dispatch, state }, data) {
      commit('setDgvInfos', data)
      dispatch("retrieveData")
      dispatch("getProfile")
    }
  },
  mutations: {
    updateTabId(state, data) {
      state.tabId = data
    },
    updateLoadingState(state, data) {
      state.hasLoaded = data
    },
    setEndpoints (state, data) {
      state.dataEndpoint = data.endpoint
      state.profileEndpoint = data.profile_endpoint
    },
    setRows (state, rows) {
      state.rows = rows
    },
    setNextRowsUrl(state, url) {
      state.nextRowsUrl = url
    },
    setProfile(state, profile) {
      state.profile = profile
    },
    setGeneralInfos (state, generalInfos) {
      state.generalInfos = generalInfos
    },
    setColumnsInfos(state, columnsInfos) {
      state.columnsInfos = columnsInfos
      for (let column in columnsInfos) {
        let infos = columnsInfos[column]
        if (infos.nb_distinct < 10) {
          const colorCat = {}
          let cpt = 0
          if (Array.isArray(infos.tops)) {
            for (let category of infos.tops) {
              if (category.value) {
                cpt = cpt + 1
                colorCat[category.value] = cpt
              }
            }
          }
          state.colorsCat[column] = colorCat
        }
      }
    },
    setPage(state, page) {
      configure({ page })
      state.page = page
    },
    setColumns(state, columns) {
      state.columns = columns
    },
    setTotalRows(state, totalRows) {
      state.totalRows = totalRows
    },
    setError(state, error) {
      state.error = error
      state.hasError = true
    },
    setSort(state, sort) {
      state.sortBy = sort.by
      state.sortDesc = sort.desc
    },
    setDgvInfos(state, data) {
      state.dgv_infos.resource = data.resource
      state.dgv_infos.dataset_id = data.dataset_id
      state.dgv_infos.dataset_title = data.dataset_title
      state.dgv_infos.organization_id = data.organization_id
      state.dgv_infos.organization_name = data.organization_name
      state.dgv_infos.other_resources = data.other_resources
    },
    addFilter(state, filter) {
      state.filters.push(filter)
      configure({ filters: state.filters })
    },
    deleteFilter(state, index) {
      state.filters.splice(index, 1)
      configure({ filters: state.filters })
    },
    deleteAllFiltersWithField(state, field) {
      state.filters = state.filters.filter((obj) => {
        return obj.field !== field
      })
    }
  }
})
