'use strict'
module.exports = ({ file, options, env }) => ({
  sourceMap: 'inline',
  plugins: {
    'autoprefixer': {
      browsers: ['> 5%', 'last 2 versions'], remove: false
    },
    // 这个插件会丢掉 sass source map 的文件名称
    // 'postcss-px2rem': {
    //   remUnit: 75
    // }
  }
})
