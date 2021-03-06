'use strict';
const fs = require('fs')
const path = require('path')

/**
 * set global
 */
global.CHALK = require('chalk')

global.APP = require('./config')

global.REDIS = require('./config/reids/redisHelper')

/**
 * mongo db
 */
require('./config/mongo/mongoConfig')

const modelsPath = path.join(APP.root, './models')

fs.readdirSync(modelsPath).forEach(file => {
  if (file.indexOf('js') !== -1) {
    require(modelsPath + '/' + file)
  }
})