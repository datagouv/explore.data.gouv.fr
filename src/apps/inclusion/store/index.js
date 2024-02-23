import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePanel: "carte",
    actualData: null,
    detailData: null,
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
    },
    mouseLocation: {
      level: 'dep',
      dep: null,
      depName: null,
    },
    saveApiUrl: [],
    saveApiResponse: {},
    locationLabels: {
      dep: null,
    },
    activeFilter: "stats_structures",
    activeSubFilter: null,
    activeSubFilterName: null,
    searchBarCoordinates: null,
    dvfCurrentSection: null,
  },
  mutations: {
    addApiResult(state, data) {
      state.saveApiUrl.push(data.url)
      state.saveApiResponse[data.url] = data.data
    },
    addActualData(state, data) {
      state.actualData = data
    },
    addDetailData(state, data) {
      state.detailData = data
    },
    changeSearchBarCoordinates(state, data) {
      console.log(data)
      state.searchBarCoordinates = data
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
    updateActiveSubFilter(state, subfilter) {
      state.activeSubFilter = subfilter
    },
    updateActiveSubFilterName(state, subfiltername) {
      state.activeSubFilterName = subfiltername
    }
  },
})
