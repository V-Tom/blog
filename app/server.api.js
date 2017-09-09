'use strict';

/**
 * fs
 */
const fs = require('fs')

/**
 * require koa
 */
const koa = require('koa')

/**
 * init all server global config
 */
require('./api/src/init')

/**
 * koa instance
 */
const app = module.exports = new koa()

/**
 * experimental for ES7
 */
app.experimental = true

/**
 * index koa configure
 */
require('./api/src/koa')(app)

/**
 * koa Routes
 */
require('./api/src/router/routes')(app)

/**
 * start app
 */
runSpdyService()

/**
 * runService
 */
function runService() {
  app.listen(CONFIG.app.port, () => {
    console.log(CHALK.green(`♪ Server started, listening on port: ${CONFIG.app.port}`))
  })
}

/**
 * runSpdyService
 */
function runSpdyService() {

  const spdy = require('spdy')

  const server = spdy.createServer({
    key: fs.readFileSync(`${__dirname}/t-tom.key`),
    cert: fs.readFileSync(`${__dirname}/t-tom.crt`)
  }, app.callback())

  server.listen(CONFIG.app.port, () => {
    console.log(CHALK.green(`♪ API Server started, listening on port: ${CONFIG.app.port}`))
  })
}