'use strict'

const path = require('path')
const fs = require('fs')
const responseTime = require('koa-response-time')
const logger = require('koa-logger')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')
const methodOverride = require('koa-methodoverride')
const send = require('koa-send')

module.exports = function (app) {

  CONFIG.app.env === 'development' && app.use(logger())

  app.use(methodOverride())

  /**
   * body parser
   */
  app.use(bodyParser())


  /**
   * x-powered-by koa
   */
  app.use(async (ctx, next) => {
    await next()
    ctx.set('X-Powered-By', 'koa2')
  })

  /**
   * compress
   */
  app.use(compress())

  /**
   * response time
   */
  app.use(responseTime())


  /**
   * static
   */
  app.use(async (ctx) => {
    await send(ctx, '/', { root: path.resolve(__dirname, '../dist'), index: 'index.html' })
  })

  /**
   * error
   */
  app.on('error', (err, ctx) => {
    console.error(err)
  })
}
