var config = require('./webpack.base.config')
var webpack = require('webpack')

config.plugins = (config.plugins || []).concat([
  new webpack.DefinePlugin({
    __DEVCLIENT__: true,
    __DEVSERVER__: false,
    __DEVTOOLS__: false,
    __DEVLOGGER__: true
  })
]);


module.exports = config
