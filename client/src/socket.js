import io from 'socket.io-client'
import store from '@/store'
import Toast from 'muse-ui-toast'
const socket = io.connect(location.origin, {
  transports: ['websocket', 'polling']
})
socket.on('connect', function (data) {
  store.commit('setAlive', true)
})
socket.on('error', function() {
  Toast.error('hello world')
  store.commit('setAlive', false)
})
socket.on('disconnect', function() {
  store.commit('setAlive', false)
})
socket.on('news', function (data) {
  socket.emit('hello', 'helloworld')
})
export default socket
