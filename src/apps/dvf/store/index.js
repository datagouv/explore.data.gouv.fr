import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
    dvfCurrentSection: null,
    leftColOpen: true,
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
    }
  },
})
