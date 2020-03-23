import io from 'socket.io-client'
import store from '@/store'
import Toast from 'muse-ui-toast'
const socket = io.connect('ws://localhost:3001', {
  transports: ['websocket', 'polling']
})
socket.on('connect', function (data) {
  console.log('data', data)
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
  console.log('news: ', data)
  socket.emit('hello', 'helloworld')
})
export default socket
