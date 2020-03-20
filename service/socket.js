const server = require('http').createServer()
const io = require('socket.io')(server);
server.listen(3001, '0.0.0.0')

let baseId = 1000
let roomIds = []
let accounts = []

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
  // socket.on('createRoom', function(fn) {
  //   let newRoomId = baseId + roomIds.length
  //   roomIds.push(newRoomId)
  //   fn(null, newRoomId)
  //   console.log('当前存在房间号：', roomIds)
  // })
  socket.on('createRoom', function(account, fn) {
    let roomId = baseId + roomInfos.size
    let detail = createRoom({
      creater: account,
      roomId: roomId
    })
    roomInfos.set(roomId, detail)
    console.log([...roomInfos])
    fn(detail)
  })
  socket.on('getRoomInfo', function(roomId, fn) {
    let result = roomInfos.get(roomId)
    console.log('roomInfos:',[...roomInfos],'\n', 'roomId:result',roomId, result)
    if (result) {
      fn ('', result)
    }
  })
  socket.emit('news', { hello: 'world' });
  socket.on('hello', function (id, data) {
    console.log('hello', data);
  });
  socket.on('join', function(fn) {
    let account = baseId + accounts.length
    accounts.push(account)
    fn(null, {
      account
    })
    io.to(socket.id).emit('joned', `新人${account}加入`)
    console.log(`新人${account}加入`)
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

function createRoom({creater, roomId, desc}) {
  return {
    creater,
    roomId,
    desc
  }
}