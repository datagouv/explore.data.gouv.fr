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
    location:{
      level: 'fra',
      dep: null,
      com: null,
      section: null,
      parcelle: null
    }
  },
  mutations: {
    changeActivePanel (state,data) {
      state.activePanel = data
    },
    changeZoomLevel (state, data){
      state.map.zoomLevel = data
    },
    changeLocationLevel (state, data){
      state.location.level = data
    },
    changeLocationDep (state, data){
      state.location.dep = data
      state.location.com = null
      state.location.section = null
      state.location.parcelle = null
    },
    changeLocationCom (state, data){
      state.location.com = data
      state.location.section = null
      state.location.parcelle = null
    },
    changeLocationSection (state, data){
      state.location.section = data
      state.location.parcelle = null
    },
    changeLocationParcelle (state, data){
      state.location.parcelle = data
    }
  }
})
