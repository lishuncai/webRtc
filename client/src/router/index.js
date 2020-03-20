import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/video',
    name: 'video',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "video" */ '../views/video.vue')
  }, 
  {
    path: '/meeting',
    name: 'meet',
    component: () => import(/* webpackChunkName: "meeting" */ '../views/meeting.vue')
  },
  {
    path: '/Room/:roomId',
    name: 'room',
    component: () => import(/* webpackChunkName: "room" */ '../views/Room.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
