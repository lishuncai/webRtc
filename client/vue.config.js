module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/webRtc'
    : '/',
  css: {
    extract: process.env.NODE_ENV === 'production'
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = false
    }
  },
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 8080,
    https: true,
    hot: true,
    proxy: {
      '/socket.io': {
        ws: true,
        target: 'ws://0.0.0.0:3001', // 后端目标接口地址
        changeOrigin: true // 是否允许跨域
      }
    }
  }
}
