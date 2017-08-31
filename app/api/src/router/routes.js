'use strict';
const Router = require('koa-router')
const errorHandler = require('koa-error')
const Boom = require('boom')
const { authAdmin } = require('../authenticated')

/**
 * controller
 */
const {
  blogDetailController,
  blogListController,
  blogUserController,
  cdnUploadController,
  frontCacheController,
  myController
} = require('../controllers')

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

  const api = new Router({ prefix: '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion })

  /**
   * front config cache
   */
  api.put('/front/setfrontstatic', authAdmin.userAdminAuthenticated(), frontCacheController.updateConfigCache)

  /**
   * blog article
   */
  api.post('/blog/article', authAdmin.userAdminAuthenticated(), blogDetailController.createArticle)
  api.get('/blog/article/:articleId', blogDetailController.getArticleDetail)
  api.put('/blog/article/:articleId', authAdmin.userAdminAuthenticated(), blogDetailController.updateArticleDetail)
  api.del('/blog/article/:articleId/:_id', authAdmin.userAdminAuthenticated(), blogDetailController.deleteArticle)

  /**
   * blog article list
   */
  api.get('/blog/list', blogListController.getArticleList)

  /**
   * auth
   */
  api.post('/auth/user/admin', blogUserController.getAdminToken)

  /**
   * CDN
   */
  api.get('/tools/cdn/upload', authAdmin.userAdminAuthenticated(), cdnUploadController.uploadFileToken)

  /**
   * resume
   */
  api.get('/my/resume', myController.getMyResume)
  api.put('/my/resume', authAdmin.userAdminAuthenticated(), myController.updateMyResume)

  /**
   * my articleRepo
   */
  api.post('/my/articleRepo', authAdmin.userAdminAuthenticated(), myController.pushArticleRepo)

  /**
   * Apply all router server
   */
  app.use(api.routes())
  app.use(api.allowedMethods({
    throw: true,
    notImplemented: () => new Boom.notImplemented(),
    methodNotAllowed: () => new Boom.methodNotAllowed()
  }))

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

  /**
   * restful API format
   */
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())
}
