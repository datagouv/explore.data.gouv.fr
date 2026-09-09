import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Taille de page imposée par l'API (`limit=20` dans api-dvf/api_aio.py).
export const TABLE_PAGE_SIZE = 20

export default new Vuex.Store({
  state: {
    activePanel: "carte",
    mapProperties: {
      lng: 2,
      lat: 46.3,
      centerLat: 2,
      centerLng: 46.3,
      zoom: null,
      zoomLevel: 4.8,
      init: true,
    },
    apiData: null,
    apiLevel: null,
    apiCode: null,
    userLocation: {
      level: 'fra',
      dep: null,
      depName: null,
      com: null,
      comName: null,
      section: null,
      sectionName: null,
      parcelle: null,
      parcelleName: null,
    },
    parcellesAdjacentes: null,
    mouseLocation: {
      level: 'dep',
      dep: null,
      depName: null,
      com: null,
      comName: null,
      section: null,
      sectionName: null,
      parcelle: null,
      parcelleName: null,
    },
    saveApiUrl: [],
    saveApiResponse: {},
    locationLabels: {
      dep: null,
      com: null
    },
    activeFilter: "tous",
    searchBarCoordinates: null,
    searchBarCityCode: null,
    searchBarCityName: null,
    searchBarType: null,
    dvfCurrentSection: null,
    leftColOpen: true,

    rows: [],
    fields: [],
    page: 1,
    hasMore: true,
    tableLevel: null,
    tableCode: null,
  },
  mutations: {
    addApiResult(state, data) {
      state.saveApiUrl.push(data.url)
      state.saveApiResponse[data.url] = data.data
    },
    changeDvfCurrentSection(state, data) {
      state.dvfCurrentSection = data
    },
    changeSearchBarCoordinates(state, data) {
      state.searchBarCoordinates = data["coord"]
      state.searchBarCityCode = data["citycode"]
      state.searchBarCityName = data["cityname"]
      state.searchBarType = data["type"]
    },
    changeActivePanel(state, data) {
      state.activePanel = data
    },
    changeZoomLevel(state, data) {
      state.mapProperties.zoomLevel = data
    },
    changeMapLat(state, data) {
      state.mapProperties.lat = data
    },
    changeMapLng(state, data) {
      state.mapProperties.lng = data
    },
    changeCenterMapLat(state, data) {
      state.mapProperties.centerLat = data
    },
    changeCenterMapLng(state, data) {
      state.mapProperties.centerLng = data
    },
    changeMapInit(state, data) {
      state.mapProperties.init = data
    },
    changeUserLocation(state, data) {
      state.userLocation = data
    },
    changeParcellesAdjacentes(state, data) {
      state.parcellesAdjacentes = data
    },
    changeMouseLocation(state, data) {
      state.mouseLocation = data
    },
    updateApiData(state, data) {
      state.apiData = data
    },
    updateApiLevel(state, data) {
      state.apiLevel = data
    },
    updateApiCode(state, data) {
      state.apiCode = data
    },
    updateActiveFilter(state, filter) {
      state.activeFilter = filter
    },
    updateLeftColOpen(state) {
      state.leftColOpen = !state.leftColOpen
    },

    updateRows(state, data) {
      // Une page pleine signifie qu'il en reste probablement d'autres.
      state.hasMore = data.length === TABLE_PAGE_SIZE
      state.rows = state.rows.concat(data)
      if (state.rows.length === 0) {
        state.fields = []
        return
      }
      state.fields = Object.keys(state.rows[0]).map((key) => ({
        key: key,
        label: key,
        sortable: false
      }))
    },
    emptyTable(state, data) {
      state.rows = []
      state.fields = []
      state.page = 1
      state.hasMore = true
      state.tableLevel = null
      state.tableCode = null
    },
    updatePage(state, data){
      state.page = data
    },
    setTableLevel(state, data){
      state.tableLevel = data
    },
    setTableCode(state, data){
      state.tableCode = data
    }
  },
})
