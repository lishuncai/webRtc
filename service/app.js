const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')
const { historyApiFallback } = require('koa2-connect-history-api-fallback');

const server = require('http').createServer(app.callback())

const io = require('socket.io')(server);

server.listen(3001, '0.0.0.0')

const index = require('./routes/index')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(path.join(__dirname, '../client/dist')))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(historyApiFallback({ whiteList: ['/api'] }));
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('hello', function (data) {
    console.log(data);
  });
});
module.exports = app
