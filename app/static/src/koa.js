'use strict'

const path = require('path')
const responseTime = require('koa-response-time')
const logger = require('koa-logger')
const views = require('co-views')
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
   * x-powered-by koa
   */
  app.use(async (ctx, next) => {
    await next()
    ctx.set('X-Powered-By', 'koa2')
  })

  /**
   * render methods
   */
  app.use((ctx, next) => {
    ctx.renderHTML = views(path.join(CONFIG.app.root, '../view'), {
      default: 'jade',
      map: { html: 'jade' },
      cache: CONFIG.app.env === 'development'
    })
    return next()
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
