import 'muse-ui/dist/muse-ui.css'

import Vue from 'vue'
import App from './App.vue'

// import './registerServiceWorker'
import router from './router'
import store from './store'
import socket from './socket'
import VConsole from 'vconsole'

import MuseUI from 'muse-ui'
import Toast from 'muse-ui-toast'
import Message from 'muse-ui-message'
Vue.use(MuseUI)
Vue.use(Message)
Vue.use(Toast)
Vue.config.productionTip = false

Vue.prototype.$socket = socket
var vConsole = new VConsole()
console.log('vConsole', vConsole)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
