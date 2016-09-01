'use strict';
const fs = require('fs')
const path = require('path')
const localConfigPath = path.join(__dirname, './local.conf.json')

let config = require('./config')
if (fs.statSync(localConfigPath)) {
  global.config = Object.assign({}, JSON.parse(fs.readFileSync(localConfigPath, 'utf8').replace(/\r?\n|\r/g, " ")), config)
}

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