
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
const offers = [
  // {
  //   account,
  //   detail
  // }
]
const answers = [
  // {
  //   account,
  //   detail
  // }
]
const candidates = [
  // {
  //   account,
  //   detail
  // }
]

io.on('connection', function (socket) {
  socket.on('createRoom', function(account, fn) {
    let roomId = String(baseId++)
    let detail = createRoom({
      creater: account,
      roomId: roomId,
      joins: new Set()
    })
    roomInfos.set(roomId, detail)
    console.log([...roomInfos])
    socket.join(roomId)
    fn(detail)
  })
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
      if (!room.joins.has(account)){
        fn(null)
        room.joins.add(account)
        socket.join(roomId)
        let joinsList = room.joins
        io.to(roomId).emit('joined', joinsList, account)
        io.to(roomId).emit('roomMessage', `新人${account}加入`)
      } else {
        fn(null)
      }
    } else {
      fn('房间不存在')
    }
  })
  socket.on('leave', function(data){
    let {roomId, account} = data
    let room = roomInfos.get(roomId)
    if (room) {
      room.joins.delete(account)
      io.to(roomId).emit('level', `${account}离开了房间`)
      if (room.joins.size === 0) {
        roomInfos.delete(roomId)
        console.log(`房间${roomId}已解散`, '剩余', roomInfos.size)
        socket.leave(roomId)
      }
    }
  })
  socket.on('offer', function(data) {
    console.log('收到offer', data)
    offers.push(data)
    socket.broadcast.to(data.roomId).emit('offer', data)
    console.log('推送offer')
  })
  socket.on('answer', function(data) {
    console.log('收到answer', data)
    answers.push(data)
    socket.broadcast.to(data.roomId).emit('answer', data)
    console.log('推送answer')
  })
  socket.on('candidate', function(data) {
    console.log('收到candidate', data)
    candidates.push(data)
    socket.broadcast.to(data.roomId).emit('candidate', data)
    console.log('推送candidate')
  })
});

io.on('disconnection', function() {
  console.log('连接中断')
  console.log('当前房间剩余', roomInfos.size, roomInfos)
})

function createRoom({creater, roomId, desc='', joins}) {
  return {
    creater,
    roomId,
    desc,
    joins
  }
}