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
  toolsController
}=require('../controllers')

module.exports = (app)=> {

  //index page render router
  const router = new Router()
  router.get('/', function *() {
    this.type = 'html'
    yield indexController.index.apply(this)
  })

  //restful API server routers
  const { config:{ app:{ restfulAPI } } }=global
  const api = new Router({ prefix: '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion })

  //blog article
  api.get('/blog/article', blogDetailController.getArticleDetail)
  api.put('/blog/article', authAdmin.userAdminAuthenticated(), blogDetailController.updateArticleDetail)
  api.post('/blog/article', authAdmin.userAdminAuthenticated(), blogDetailController.createArticle)
  api.del('/blog/article', authAdmin.userAdminAuthenticated(), blogDetailController.deleteArticle)

  //blog article list
  api.get('/blog/articlelist', blogListController.getArticleList)

  //blog article reply
  api.get('/blog/reply', blogCommitController.getArticleReply)
  api.post('/blog/reply', authUser.userReplyAuthenticated(), blogCommitController.addArticleReply)
  api.del('/blog/reply', authAdmin.userAdminAuthenticated(), blogCommitController.deleteReply)

  //tools
  api.get('/tools/libs/verifyCode', authUser.userReplyAuthenticated(), toolsController.verifyCode)
  api.get('/tools/cdn/upload', authAdmin.userAdminAuthenticated(), cdnUploadController.uploadFile)

  //blog article user
  //TODO Test Token
  api.post('/blog/user/getToken', blogUserController.getToken)
  api.post('/blog/user/getAdminToken', blogUserController.getAdminToken)
  api.get('/blog/user/auth', blogUserController.updateUser)

  //restful API format
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  if (!process.env.NODE_ENV === 'development') {
    app.use(errorHandler())
  } else {
    app.use(require('../middlewares/middlewares.form.error.handler')())
  }

  // Apply all router server
  app.use(router.routes())
  app.use(api.routes())

}
