'use strict'

const path = require('path')
const serve = require('koa-static-cache')
const responseTime = require('koa-response-time')
const logger = require('koa-logger')
const views = require('co-views')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')
const methodOverride = require('koa-methodoverride')
const cors = require('koa-cors')

module.exports = function (app) {

  process.env.NODE_ENV === 'development' && app.use(logger())
  app.use(methodOverride())
  app.use(bodyParser())
  app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  }))

  app.use(function *(next) {
    this.render = views(path.join(config.app.root, '../view'), {
      default: 'jade',
      map: { html: 'jade' },
      cache: process.env.NODE_ENV === 'development' ? false : 'memory'
    })
    yield next
  })
  
  app.use(serve(path.join(__dirname, '../../static'), {
    maxAge: 24 * 60 * 60
  }))

  app.use(compress())
  app.use(responseTime())
}
