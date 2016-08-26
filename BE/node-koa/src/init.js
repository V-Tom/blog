'use strict';
const fs = require('fs')
const path = require('path')


global.config = require('./config')

process.env.NODE_ENV = config.app.env

global.redis = require('./config/redisHelper')


/**
 * Load the models
 */
const modelsPath = path.join(config.app.root, './models')
fs.readdirSync(modelsPath).forEach(file => {
  if (file.indexOf('js') !== -1) {
    require(modelsPath + '/' + file)
  }
})