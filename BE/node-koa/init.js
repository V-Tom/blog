'use strict';
const fs = require('fs')
const path = require('path')

global.config = require('./config')

/**
 * Load the models
 */
const modelsPath = path.join(global.config.app.root, './models')
fs.readdirSync(modelsPath).forEach(file => {
  if (file.indexOf('js') !== -1) {
    require(modelsPath + '/' + file)
  }
})