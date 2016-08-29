const ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack')
var config = require('./webpack.base.config')

config.externals = {}

config.plugins = (config.plugins || []).concat([
  // this allows uglify to strip all warnings
  // from Vue.js source code.
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  //文件头部指定的注释信息
  new webpack.BannerPlugin('This file is created by Nomand'),
  //将样式统一发布到style.css中
  new ExtractTextPlugin("fullStack-[hash].css", {
    allChunks: true,
    disable: false
  }),
  // This minifies not only JavaScript, but also
  // the templates (with html-minifier) and CSS (with cssnano)!
  new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false
    },
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin()
])

module.exports = config
