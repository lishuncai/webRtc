import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/layout/router-view'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    components: {
      default: layout,
      nav: () => import(/* webpackChunkName: "meeting" */ '@/views/nav')
    },
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "meeting" */ '@/views/Home')
      },
      {
        path: '/meeting',
        name: 'meeting',
        component: () => import(/* webpackChunkName: "meeting" */ '@/views/meeting')
      }
    ]
  },
  // {
  //   path: '/video',
  //   name: 'video',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "video" */ '../views/video')
  // },

  {
    path: '/Room/:roomId',
    name: 'room',
    component: () => import(/* webpackChunkName: "room" */ '../views/Room')
  }
]

const router = new VueRouter({
  routes
})

export default router
