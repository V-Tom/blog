'use strict'

const path = require('path')
const serve = require('koa-static-cache')
const responseTime = require('koa-response-time')
const logger = require('koa-logger')
const views = require('co-views')
const compress = require('koa-compress')
const errorHandler = require('koa-error')
const bodyParser = require('koa-bodyparser')
const formErrorHandler = require('../middlewares/formErrorHandler')
const methodOverride = require('koa-methodoverride')


const STATIC_FILES_MAP = {}
const SERVE_OPTIONS = {maxAge: 365 * 24 * 60 * 60}

module.exports = function (app) {
  let config = global.config
  if (config.app.env !== 'test') {
    app.use(logger())
  }

  app.use(errorHandler())
  app.use(formErrorHandler())

  app.use(bodyParser())
  app.use(methodOverride())

  app.use(function *(next) {
    this.render = views(path.join(config.app.root, './view'), {
      default: 'jade',
      map: {html: 'jade'},
      cache: config.app.env === 'development' ? 'memory' : false,
    })
    yield next
  })

  app.use(compress())
  app.use(responseTime())
}
