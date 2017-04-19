'use strict';
const Router = require('koa-router')
const errorHandler = require('koa-error')

const { authUser, authAdmin } = require('../authenticated')

// all controller
const {
  indexController,
  blogDetailController,
  blogListController,
  blogUserController,
  cdnUploadController,
  toolsController,
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
  const router = new Router()

  router.get('/*', function *() {
    let config = yield frontCacheController.getCacheConfig()
    this.type = 'html'
    yield indexController.renderIndexView.call(this, config)
  })

  // restful API server routers
  const { restfulAPI } = global.config.app
  const api = new Router({ prefix: '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion })

  //front config cache
  api.put('/front/setfrontstatic', authAdmin.userAdminAuthenticated(), frontCacheController.updateConfigCache)

  //blog article
  api.get('/blog/article/:articleId', blogDetailController.getArticleDetail)
  api.post('/blog/article', authAdmin.userAdminAuthenticated(), blogDetailController.createArticle)
  api.put('/blog/article/:articleId', authAdmin.userAdminAuthenticated(), blogDetailController.updateArticleDetail)
  api.del('/blog/article/:articleId/:_id', authAdmin.userAdminAuthenticated(), blogDetailController.deleteArticle)

  // blog article list
  api.get('/blog/articlelist', blogListController.getArticleList)

  // blog article reply
  // api.get('/blog/reply', blogCommitController.getArticleReply)
  // api.post('/blog/reply', authUser.userReplyAuthenticated(), blogCommitController.addArticleReply)
  // api.del('/blog/reply', authAdmin.userAdminAuthenticated(), blogCommitController.deleteReply)

  // auth
  // api.post('/auth/user/getUserToken', blogUserController.getUserToken)
  api.post('/auth/user/getAdminToken', blogUserController.getAdminToken)

  // tools
  // api.get('/tools/libs/verifyCode', authUser.userReplyAuthenticated(), toolsController.verifyCode)
  api.get('/tools/cdn/upload', authAdmin.userAdminAuthenticated(), cdnUploadController.uploadFileToken)
  api.post('/tools/tinypng', toolsController.tinyPNG)

  // my resume
  api.get('/my/resume', myController.getMyResume)
  api.put('/my/resume', authAdmin.userAdminAuthenticated(), myController.updateMyResume)

  // my articleRepo
  api.post('/my/articleRepo', authAdmin.userAdminAuthenticated(), myController.pushArticleRepo)

  // Apply all router server
  app.use(api.routes())
  app.use(router.routes())

  //restful API format
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  // 404
  app.use(function *() {
    this.body = {
      status: 404,
      msg: 'sorry,API document does not found'
    }
  })

  // error
  app.on('error', (err, ctx) => {
    console.error(err)
  });

}
