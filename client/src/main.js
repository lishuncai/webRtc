import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import socket from './socket'
import VConsole from 'vconsole'

Vue.config.productionTip = false

Vue.$socket = socket
var vConsole = new VConsole()
console.log('vConsole', vConsole)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
