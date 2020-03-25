module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/webRtc'
    : '/',
  css: {
    extract: false
  }
  // devServer: {
  //   open: false,
  //   host: '0.0.0.0',
  //   port: 8080,
  //   https: false,
  //   hotOnly: false,
  //   proxy: {
  //     '/socket.io': {
  //       target: 'ws://47.106.9.184:3000', // 后端目标接口地址
  //       changeOrigin: true // 是否允许跨域
  //     }
  //   }
  // }
}
