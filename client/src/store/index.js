import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socketAlive: false,
    account: null
  },
  getters: {
    account: state => {
      if (!state.account) {
        const account = sessionStorage.getItem('account')
        state.account = account
      }
      return state.account
    }
  },
  mutations: {
    setAlive(state, bool) {
      state.socketAlive = bool
    },
    account(state, account) {
      state.account = account
      sessionStorage.setItem('account', account)
    }
  },
  actions: {
  },
  modules: {
  }
})
