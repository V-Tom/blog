'use strict'
const config = require('./webpack.base.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

config.entry = {
  vendor: ['react', 'react-dom', 'history', 'react-router', 'redux', 'react-redux', 'react-router-redux', 'moment', 'highcharts', 'highcharts/modules/map'],
  app: path.join(__dirname, '../src/app.js')
}

config.output = {
  filename: '[name]-[hash].js',
  chunkFilename: '[name].js'
}


config.module.loaders = config.module.loaders.concat(
  [{
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer')
  }, {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('less', 'css?sourceMap!less-loader?sourceMap')
  }]
)

// Plugins
const optimizePlugins = argv.development ? [] : [
  new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false
    },
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.NoErrorsPlugin()
]

const extractTextPlugins = argv.development ? [] : [

  new ExtractTextPlugin('app-[hash].css', {
    allChunks: true,
    disable: false
  }),

  //文件头部指定的注释信息
  new webpack.BannerPlugin('Video++ live console FE')
]

const commonsChunkPlugin = argv.development ? [] : [
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-[hash].js')
]

config.plugins = config.plugins.concat([optimizePlugins, extractTextPlugins, commonsChunkPlugin])

config.devtool = null