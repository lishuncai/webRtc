const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server);

server.listen(3000);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('hello', function (data) {
    console.log(data);
  });
});