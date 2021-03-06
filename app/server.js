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
require('./src/init')

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
require('./src/koa')(app)

/**
 * koa Routes
 */
require('./src/router/routes')(app)

/**
 * start app
 */
runService()

/**
 * runService
 */
function runService() {
  app.listen(APP.port, () => {
    console.log(CHALK.green(`♪ Server started, listening on port: ${APP.port}`))
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

  server.listen(APP.port, () => {
    console.log(CHALK.green(`♪ API Server started, listening on port: ${APP.port}`))
  })
}