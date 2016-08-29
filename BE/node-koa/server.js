'use strict';

const debug = require('debug')
const log = debug('app:server.js')
const koa = require('koa')

//init all server global config
require('./src/init')

const app = koa()
require('./src/config/koa')(app)

// Routes
require('./src/config/routes')(app)


// Start app
app.listen(config.app.port)
log('Server started, listening on port: ' + config.app.port)
log('Environment: ' + config.app.env)

// Export test agent
module.exports = app