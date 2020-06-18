import '@/assets/reset.css'
import 'heyui/themes/index.less'
import Vue from 'vue'
import App from './App.vue'

// import './registerServiceWorker'
import router from './router'
import store from './store'
import io from './socket'

import HeyUI from 'heyui'
Vue.use(HeyUI)
Vue.prototype.$io = io
Vue.directive('svgIcon', {
  // 指令的定义, 注意：自定义指令表达式不能带'#'，会报错
  inserted: function (el, binding) {
    el.innerHTML = `
      <svg class="icon" aria-hidden="true">
          <use xlink:href="${binding.value}"></use>
      </svg>
    `
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
