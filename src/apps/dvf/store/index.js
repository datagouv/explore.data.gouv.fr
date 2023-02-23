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
    }
  },
  mutations: {
    changeActivePanel (state,data) {
      state.activePanel = data
    },
  }
})
