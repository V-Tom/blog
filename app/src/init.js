'use strict';
const fs = require('fs')
const path = require('path')

/**
 * set global
 */
global.config = require('./config')

global.chalk = require('chalk')

global.redis = require('./config/reids/redisHelper')


/**
 * set environment
 */
process.env.NODE_ENV = config.app.env


/**
 * Load the models
 */
const modelsPath = path.join(config.app.root, './models')
fs.readdirSync(modelsPath).forEach(file => {
  if (file.indexOf('js') !== -1) {
    require(modelsPath + '/' + file)
  }
})