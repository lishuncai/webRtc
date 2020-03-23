const server = require('http').createServer()
const io = require('socket.io')(server);
server.listen(3001, '0.0.0.0')

let baseId = 1000
let roomIds = []

let roomInfos = new Map()
let offers = [
  // {
  //   account,
  //   desc
  // }
]
let answers = [
  // {
  //   account,
  //   desc
  // }
]
let candidate = [
  // {
  //   account,
  //   desc
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
    console.log('roomInfos:',[...roomInfos],'\n', 'roomId:result',roomId, result)
    if (result) {
      fn ('', result)
    } else {
      fn('找不到房间')
    }
  })
  socket.emit('news', { hello: 'world' });
  socket.on('hello', function (id, data) {
    console.log('hello', data);
  });
  socket.on('join', function(data, fn) {
    const {roomId, account} = data
    const room = roomInfos.get(roomId)
    console.log('根据id查询room',typeof data.roomId, data.roomId, room)
    if (room && account) {
      if (!room.joins.has(account)){
        room.joins.add(account)
        fn(null)
        socket.join(roomId)
        io.to(roomId).emit('joned', `新人${account}加入`)
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
        roomInfos.delete(roomInfos)
        console.log(`房间${roomId}已解散`, '剩余', roomInfos.size)
        socket.leave(roomId)
      }
    }
  })
  socket.on('offer', function(data) {
    offers.push(data)
    socket.broadcast.emit('offer', data)
    console.log('推送offer')
  })
  socket.on('answer', function(data) {
    answers.push(data)
    socket.broadcast.emit('answer', data)
    console.log('推送answer')

  })
  socket.on('candidate', function(data) {
    candidate.push(data)
    socket.broadcast.emit('candidate', data)
    console.log('推送candidate')
  })
});

io.on('disconnection', function() {
  console.log('连接终端')
  roomIds = []
})

function createRoom({creater, roomId, desc='', joins}) {
  return {
    creater,
    roomId,
    desc,
    joins
  }
}