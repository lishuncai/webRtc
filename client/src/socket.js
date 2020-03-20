import io from 'socket.io-client'

const socket = io.connect('ws://localhost:3001', {
  transports: ['websocket', 'polling']
})
socket.on('connect', function (data) {
  console.log('data', data)
})
socket.on('news', function (data) {
  console.log('news: ', data)
  socket.emit('hello', 'helloworld')
})
export default socket
