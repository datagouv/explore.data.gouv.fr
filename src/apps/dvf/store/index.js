import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePanel:"carte",
    map:{
      lng:2,
      lat:46.3,
      zoom:null,
      zoomLevel:4.8
    },
    apiData:null,
    apiLevel:null,
    apiCode:null,
    userLocation:{
      level: 'fra',
      dep: null,
      com: null,
      section: null,
      parcelle: null
    },
    mouseLocation:{
      level: 'dep',
      dep: null,
      com: null,
      section: null,
      parcelle: null,
    },
    saveApiUrl: [],
    saveApiResponse: {},
    locationLabels:{
      dep:null,
      com: null
    },
    activeFilter:"tous",
    searchBarCoordinates: null,
    dvfCurrentSection: null,
  },
  mutations: {
    addApiResult( state, data) {
      state.saveApiUrl.push(data.url)
      state.saveApiResponse[data.url] = data.data
    },
    changeDvfCurrentSection( state, data) {
      state.dvfCurrentSection = data
    },
    changeSearchBarCoordinates( state, data) {
      state.searchBarCoordinates = data
    },
    changeActivePanel (state,data) {
      state.activePanel = data
    },
    changeZoomLevel (state, data){
      state.map.zoomLevel = data
    },
    changeUserLocation (state, data) {
      state.userLocation = data 
    },
    changeMouseLocation (state, data) {
      state.mouseLocation = data 
    },
    updateApiData (state, data){
      state.apiData = data
    },
    updateApiLevel (state, data){
      state.apiLevel = data
    },
    updateApiCode(state, data){
      state.apiCode = data
    },
    updateActiveFilter(state,filter){
      state.activeFilter = filter
    }
  },
})
