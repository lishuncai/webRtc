import io from 'socket.io-client'
import store from '@/store'
import heyui from 'heyui'
const spaceList = {}
const IP = process.env.NODE_ENV === 'development'
  ? `${location.origin}` : location.origin
/**
 *
 * @param {String} name /room/124
 */
// 根据路径获取对的socket对象
function getSocketSpace(name = '') {
  let socket = spaceList['id' + name]
  if (!socket) {
    socket = io.connect(IP + name, {
      transports: ['websocket', 'polling']
    })
    socket.on('connect', function (data) {
      console.log(IP + name, '连接成功')
    })
    spaceList['id' + name] = socket
  }
  socket.open()
  return socket
}
function deleteSocket(name) {
  return new Promise((resolve, reject) => {
    const socket = spaceList['id' + name]
    if (socket) {
      socket.close()
      spaceList['id' + name] = null
      resolve()
    } else {
      reject(new Error('该socket不存在'))
    }
  })
}

const socket = getSocketSpace()
socket.on('connect', function (data) {
  store.commit('setAlive', true)
})
socket.on('error', function() {
  heyui.$message.error('hello world')
  store.commit('setAlive', false)
})
socket.on('disconnect', function() {
  store.commit('setAlive', false)
})
socket.on('news', function (data) {
  heyui.$message.info(data)
})

export default {
  socket,
  getSocketSpace,
  deleteSocket
}
