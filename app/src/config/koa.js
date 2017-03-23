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

  config.app.env === 'development' && app.use(logger())

  app.use(methodOverride())

  // body parser
  app.use(bodyParser())

  // cors
  app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  }))

  // x-powered-by koa
  app.use(async (ctx, next) => {
    await next()
    ctx.set('X-Powered-By', 'koa')
  })

  // render methods
  app.use((ctx, next) => {
    ctx.renderHTML = views(path.join(config.app.root, '../view'), {
      default: 'jade',
      map: { html: 'jade' },
      cache: config.app.env === 'development'
    })
    return next()
  })

  // static file directory
  // TODO 官方不支持，有时间自己写一个
  // app.use(serve(path.join(__dirname, '../../static'), {
  //   maxAge: 24 * 60 * 60
  // }))

  // compress
  app.use(compress())

  // response time
  app.use(responseTime())

  // error
  app.on('error', (err, ctx) => {
    console.error(err)
  })
}
