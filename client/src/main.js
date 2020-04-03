import 'muse-ui/dist/muse-ui.css'
import adapter from 'webrtc-adapter'

import Vue from 'vue'
import App from './App.vue'

// import './registerServiceWorker'
import router from './router'
import store from './store'
import io from './socket'
// import VConsole from 'vconsole'

import MuseUI from 'muse-ui'
import Toast from 'muse-ui-toast'
import Message from 'muse-ui-message'
Vue.use(MuseUI)
Vue.use(Message)
Vue.use(Toast, {
  position: 'bottom', // 弹出的位置
  time: 2000, // 显示的时长
  closeIcon: 'close', // 关闭的图标
  close: true, // 是否显示关闭按钮
  successIcon: 'check_circle', // 成功信息图标
  infoIcon: 'info', // 信息信息图标
  warningIcon: 'priority_high', // 提醒信息图标
  errorIcon: 'warning' // 错误信息图标
})
Vue.config.productionTip = false

console.log('adapter', adapter.browserDetails.version)
Vue.prototype.$io = io
// const vConsole = new VConsole()
// console.log('vConsole', vConsole)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
