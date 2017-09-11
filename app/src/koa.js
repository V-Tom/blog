'use strict'

const path = require('path')
const views = require('co-views')
const responseTime = require('koa-response-time')
const logger = require('koa-logger')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')
const methodOverride = require('koa-methodoverride')
const cors = require('kcors')

module.exports = function (app) {

  app.use(logger())

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
   * render methods
   */
  app.use((ctx, next) => {
    ctx.renderHTML = views(path.resolve(__dirname, './view'), {
      default: 'jade',
      map: { html: 'jade' },
      cache: CONFIG.app.env === 'development'
    })
    return next()
  })

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
