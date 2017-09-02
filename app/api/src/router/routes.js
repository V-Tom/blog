'use strict';
const errorHandler = require('koa-error')

module.exports = (app) => {

  /**
   * global catch server error format
   */
  if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler())
  } else {
    app.use(require('../middlewares/middlewares.form.error.handler.js')())
  }

  /**
   * restful API server routers
   */
  const { app: { restfulAPI } } = global.CONFIG

  const prefix = '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion

  /**
   * Apply all router server
   */
  app.use(require('./blog.article.router')(prefix).routes())
  app.use(require('./blog.list.router')(prefix).routes())
  app.use(require('./front.router')(prefix).routes())
  app.use(require('./auth.router')(prefix).routes())
  app.use(require('./my.router')(prefix).routes())
  app.use(require('./tools.router')(prefix).routes())

  /**
   * 404
   */
  app.use(async (ctx, next) => {
    if (ctx.status === 404) {
      ctx.status = 200
      ctx.body = {
        status: 404,
        result: {
          msg: 'sorry ,API document doesn\'t found'
        }
      }
    }
  })
}
