'use strict';

// require koa
const koa = require('koa')

// init all server global config
require('./src/init')

// koa instance
const app = module.exports = new koa()

// experimental for ES7
app.experimental = true

// index koa configure
require('./src/config/koa')(app)

// koa Routes
require('./src/router/routes')(app)


// start app
app.listen(config.app.port)

console.log(chalk.cyan(`♪ Server started, listening on port: ${config.app.port}`))
console.log(chalk.green(`Environment: ${config.app.env}`))