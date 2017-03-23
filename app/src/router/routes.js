'use strict';
const Router = require('koa-router')
const errorHandler = require('koa-error')

const { authUser, authAdmin } = require('../authenticated')
const middleWaresRestFulApi = require('../middlewares/middlewares.restfulAPI.response.js')

// all controller
const {
  indexController,
  blogDetailController,
  blogListController,
  blogUserController,
  cdnUploadController,
  frontCacheController,
  myController
} = require('../controllers')

module.exports = (app) => {

  // global catch server error format
  if (config.app.env === 'development') {
    app.use(errorHandler())
  } else {
    app.use(require('../middlewares/middlewares.form.error.handler.js')())
  }

  // index page render router
  const IndexRouter = new Router()

  IndexRouter.get('/', indexController.renderIndexView)

  // restful API server routers
  const { app: { restfulAPI } } = global.config
  const api = new Router({ prefix: '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion })

  // front config cache
  api.put('/front/setfrontstatic', authAdmin.userAdminAuthenticated(), frontCacheController.updateConfigCache)

  // blog article
  api.get('/blog/article/:articleId', blogDetailController.getArticleDetail)
  api.post('/blog/article', authAdmin.userAdminAuthenticated(), blogDetailController.createArticle)
  api.put('/blog/article/:articleId', authAdmin.userAdminAuthenticated(), blogDetailController.updateArticleDetail)
  api.del('/blog/article/:articleId/:_id', authAdmin.userAdminAuthenticated(), blogDetailController.deleteArticle)

  // blog article list
  api.get('/blog/articlelist', blogListController.getArticleList)

  // auth
  api.post('/auth/user/getAdminToken', blogUserController.getAdminToken)

  api.get('/tools/cdn/upload', authAdmin.userAdminAuthenticated(), cdnUploadController.uploadFileToken)

  // my resume
  api.get('/my/resume', myController.getMyResume)
  api.put('/my/resume', authAdmin.userAdminAuthenticated(), myController.updateMyResume)

  // my articleRepo
  api.post('/my/articleRepo', authAdmin.userAdminAuthenticated(), myController.pushArticleRepo)

  // restful API format
  api.use(middleWaresRestFulApi())

  // Apply all router server
  app.use(api.routes())
  app.use(IndexRouter.routes())

  // 404
  app.use(async (ctx, next) => {
    await next()
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
