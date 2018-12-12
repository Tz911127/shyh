const fs = require('fs')
const glob = require("glob")
const px2vw = require("postcss-px-to-viewport")

const webpack = require('webpack')
const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const pages = {}
let entries
try {
  // 获取相关入口
  entries = glob('src/pages/*/index.js', {
    sync: true
  })
} catch (err) {
  entries = []
  throw err
}
// 格式化生成入口
entries.forEach((file) => {
  // file字符串为 src/views/.../index.js
  const fileSplit = file.split('/')
  const pageName = fileSplit[2]
  let pageHtml = fileSplit.slice(0, 3).join('/') + '/index.html'
  if (!fs.existsSync(pageHtml)) {
    // 入口如果不配置直接使用 _default.html
    pageHtml = fileSplit.slice(0, 2).join('/') + '/_default.html'
  }
  pages[pageName] = {
    entry: file,
    template: pageHtml,
    filename: `${pageName}.html`
  }
})

//项目路径
const BASE_URL = process.env.NODE_ENV === 'production' ?
  '/prize' :
  '/'


module.exports = {
  pages,
  baseUrl: BASE_URL,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
      })
    ]
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  css: {
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      },
      postcss: {
        plugins: () => [px2vw({
          viewportWidth: 750,
          viewporHeight: 134,
          unitPrecision: 3,
          viewportUnit: 'vw',
          selectorBlackList: ['.ignore', '.hairlines'],
          minPixelValue: 1,
          mediaQuery: false
        })]
      }
    }
  },
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    host: '',
    port: 3030,
    proxy: {
      '/api': {
        // target: 'http://localhost:3000/api/',
        target:"http://192.168.1.103:9090",
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}