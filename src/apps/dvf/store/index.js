import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePanel:"carte"
  },
  mutations: {
    changeActivePanel (state,data) {
      state.activePanel = data
    },
  }
})
