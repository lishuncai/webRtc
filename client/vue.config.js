const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  productionSourceMap: false,
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
    return {
      plugins: [
        new CompressionPlugin({
          test: /(.js|.css)$/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        })
      ]
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
        target: 'http://localhost:3001', // 后端目标接口地址
        changeOrigin: true // 是否允许跨域
      }
    }
  }
}
