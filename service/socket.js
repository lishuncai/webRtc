const fs = require("fs")
const httpsServer = require('https').createServer({
  key : fs.readFileSync("./cert/cert.key"),
  cert: fs.readFileSync("./cert/cert.pem")
})
const useHttps = 0;
const server = require('http').createServer();
const io = require('socket.io')(useHttps?httpsServer:server);
useHttps?httpsServer.listen(3001, '0.0.0.0'):server.listen(3001, '0.0.0.0')
let baseId = 1000

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
    console.log('收到offer', data)
    let {roomId, desc} = data
    offers.push({
      roomId: roomId,
      detail: desc
    })
    socket.broadcast.to(roomId).emit('offer', desc)
    console.log('推送offer')
  })
  socket.on('answer', function(data) {
    console.log('收到answer', data)
    let {roomId, desc} = data
    answers.push({
      roomId: roomId,
      detail: desc
    })
    socket.broadcast.to(roomId).emit('answer', desc)
    console.log('推送answer')
  })
  socket.on('candidate', function(data) {
    console.log('收到candidate', data)
    let {roomId, candidate} = data
    let obj  = {
      roomId: roomId,
      detail: candidate
    }
    candidates.push(obj)
    socket.broadcast.to(roomId).emit('candidate', obj)
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