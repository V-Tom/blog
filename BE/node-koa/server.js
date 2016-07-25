'use strict';

const debug = require('debug')
const log = debug('app:server.js')
const koa = require('koa')

//init all server global config
require('./init')

const app = koa()
require('./config/koa')(app)


// CORS
app.use(function *(next) {
  const requestOrigin = this.get('Origin')
  const headers = this.get('access-control-request-headers')
  this.set('Access-Control-Allow-Origin', requestOrigin)
  this.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
  this.set('Access-Control-Allow-Headers', headers)
  // this.set('Access-Control-Allow-Credentials', true); // 有csrf问题, 用header
  if (this.method === 'OPTIONS') {
    this.status = 204
  } else {
    yield next
  }
})

// Routes
require('./config/routes')(app)


// Start app
app.listen(config.app.port)
log('Server started, listening on port: ' + config.app.port)
log('Environment: ' + config.app.env)

// Export test agent
module.exports = app