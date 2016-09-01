'use strict';
const Router = require('koa-router')
const errorHandler = require('koa-error')

const { authUser, authAdmin } =require('../authenticated')

//all controller
const {
  indexController,
  blogDetailController,
  blogCommitController,
  blogListController,
  blogUserController,
  cdnUploadController,
  toolsController,
  frontCacheController
}=require('../controllers')

module.exports = (app)=> {

  //index page render router
  const router = new Router()
  router.get('/*', function *() {
    let config = yield frontCacheController.getCacheConfig()
    this.type = 'html'
    yield indexController.renderIndexView.call(this, config)
  })

  //restful API server routers
  const { config:{ app:{ restfulAPI } } }=global
  const api = new Router({ prefix: '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion })

  //front config cache
  api.put('/front/setfrontstatic', authAdmin.userAdminAuthenticated(), frontCacheController.updateConfigCache)

  //blog article
  api.get('/blog/article', blogDetailController.getArticleDetail)
  api.post('/blog/article', authAdmin.userAdminAuthenticated(), blogDetailController.createArticle)
  api.put('/blog/article/:articleId', authAdmin.userAdminAuthenticated(), blogDetailController.updateArticleDetail)
  api.del('/blog/article/:articleId/:_id', authAdmin.userAdminAuthenticated(), blogDetailController.deleteArticle)

  //blog article list
  api.get('/blog/articlelist', blogListController.getArticleList)

  //blog article reply
  api.get('/blog/reply', blogCommitController.getArticleReply)
  api.post('/blog/reply', authUser.userReplyAuthenticated(), blogCommitController.addArticleReply)
  api.del('/blog/reply', authAdmin.userAdminAuthenticated(), blogCommitController.deleteReply)

  //tools
  api.get('/tools/libs/verifyCode', authUser.userReplyAuthenticated(), toolsController.verifyCode)
  api.get('/tools/cdn/upload', authAdmin.userAdminAuthenticated(), cdnUploadController.uploadFile)
  api.post('/tools/front/update', authAdmin.userAdminAuthenticated(), toolsController.updateFront)

  //blog article user
  //TODO Test Token
  api.post('/blog/user/getUserToken', blogUserController.getUserToken)
  api.post('/blog/user/getAdminToken', blogUserController.getAdminToken)

  //用户第一次登录
  api.get('/blog/user/oAuth', blogUserController.updateUser)

  //用户二次登录,根据 cookies 拿到 老的TOKEN 重新生成的APP TOKEN
  api.get('/blog/user/sign', blogUserController.sign)

  //restful API format
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  if (config.app.env === 'development') {
    app.use(errorHandler())
  } else {
    app.use(require('../middlewares/middlewares.form.error.handler')())
  }

  // Apply all router server
  app.use(api.routes())
  app.use(router.routes())

}
