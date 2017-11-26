'use strict'
const config = require('./webpack.base.js')

config.entry = ['babel-polyfill', path.join(__dirname, '../src/app.js')]

config.output = {
  filename: 'app.js',
  publicPath: 'assets',
  chunkFilename: '[id].js',
  sourceMapFilename: 'debugging/[file].map'
}

config.externals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'react-router': 'ReactRouter',
  'redux': 'Redux',
  'react-redux': 'ReactRedux',
  'history': 'History'
}

config.devServer = {
  host: '127.0.0.1',
  port: '3000',
  historyApiFallback: true,
  stats: {
    exclude: [/node_modules/]
  }
}

config.devtool = 'cheap-module-eval-source-map'

config.module.loaders.concat(
  [{
    test: /\.less$/,
    loader: 'style!css?sourceMap!autoprefixer!less-loader?sourceMap'
  }, {
    test: /\.css$/,
    loader: 'style!css?sourceMap!autoprefixer'
  }]
)