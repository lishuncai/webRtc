
const path = require('path')
const fs = require('fs')
const router = require('koa-router')()

// router.get('/', async (ctx, next) => {
//   ctx.type = 'text/html'
//   fs.readFileSync(path.join(__dirname, '../../client/dist/index.html'), (err, data) => {
//     if (err) throw (err)
//     ctx.body = data
//   })
// })


module.exports = router
