
const server = require('http').createServer();
const io = require('socket.io')(server);
server.listen(3001, '0.0.0.0')
let baseId = 1000

/**
 * {
      creater: account,
      roomId: roomId,
      joins: new Set()
    }
 */
const roomInfos = new Map()
const socketIdMap = new Map()

io.on('connection', function (socket) {
  socket.on('createRoom', function(account, fn) {
    let roomId = String(baseId++)
    let detail = {
      creater: account,
      roomId: roomId,
      desc: '',
      joins: new Set()
    }
    roomInfos.set(roomId, detail)
    console.log([...roomInfos])
    socket.join(roomId)
    const nsp = io.of(`/room/${roomId}`)
    fn(detail)
    nsp.on('connection', function(sock) {
      createRoom(sock, nsp)
    })
  })
  socket.on('enterRoom', function({roomId, account}, fn){
    socketIdMap.set(socket.id, {
      roomId,
      account
    })
    const room = roomInfos.get(roomId)
    if (room) {
      fn()
    } else {
      fn('房间不存在')
    }
  })
  socket.on('disconnect', function () { // 这里监听 disconnect，就可以知道谁断开连接了
    if (socketIdMap.has(socket.id)) {
      const info = socketIdMap.get(socket.id)
      console.log(info, '断开连接')
      const room = roomInfos.get(info.roomId)
      if (room && room.joins) {
        room.joins.delete(info.account)
      }
      socket.broadcast.emit('leave', info.account)
      socketIdMap.delete(socket.id)      
    }
  })
});

io.on('disconnection', function() {
  console.log('连接中断')
  console.log('当前房间剩余', roomInfos.size, roomInfos)
})
function createRoom(socket, nsp) {
  socket.on('getRoomInfo', function(roomId, fn) {
    let result = roomInfos.get(roomId)
    console.log('roomInfos:', [...roomInfos], '\n', 'roomId:result',roomId, result)
    if (result) {
      fn ('', result)
    } else {
      fn('找不到房间')
    }
  })
  socket.emit('news', 'socket已连接');
  socket.on('join', function(data, fn) {
    const {roomId, account} = data
    const room = roomInfos.get(roomId)
    console.log('根据id查询room',typeof data.roomId, data.roomId, room)
    if (room && account) {
      fn(null)
      room.joins.add(account)
      socket.join(roomId)
      let joinsList = [...room.joins]
      nsp.emit('joined', {
        list: joinsList,
        account
      })
      nsp.emit('roomMessage', `${account}加入了房间`)
    } else {
      fn('房间不存在')
    }
  })
  // 聊天
  socket.on('chat', function(data) {
    nsp.emit('roomMessage', data)
  })
  socket.on('leave', function(data){
    let {roomId, account} = data
    let room = roomInfos.get(roomId)
    if (room) {
      room.joins.delete(account)
      socket.broadcast.emit('roomMessage', `${account}离开了房间`)
      if (room.joins.size === 0) {
        roomInfos.delete(roomId)
        console.log(`房间${roomId}已解散`, '剩余', roomInfos.size)
        socket.leave(roomId)
        nsp.close && nsp.close()
      } else {
        socket.broadcast.emit('leave', account)
      }
    }
  })
  socket.on('offer', function(data) {
    socket.broadcast.emit('offer', data)
  })
  socket.on('answer', function(data) {
    socket.broadcast.emit('answer', data)
  })
  socket.on('candidate', function(data) {
    socket.broadcast.emit('candidate', data)
  })
}