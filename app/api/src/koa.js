'use strict'

const path = require('path')
const responseTime = require('koa-response-time')
const logger = require('koa-logger')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')
const methodOverride = require('koa-methodoverride')
const cors = require('kcors')

module.exports = function (app) {

  CONFIG.app.env === 'development' && app.use(logger())

  app.use(methodOverride())

  /**
   * body parser
   */
  app.use(bodyParser())

  /**
   * cors
   */
  app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  }))

  /**
   * set header
   */
  const now = Date.now()
  app.use(async (ctx, next) => {
    await next()
    ctx.set('X-Powered-By', 'koa')
    ctx.set('X-build-time', now)
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
   * error
   */
  app.on('error', (err, ctx) => {
    console.error(err)
  })
}
