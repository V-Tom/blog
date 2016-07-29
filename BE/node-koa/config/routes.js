'use strict';
const Router = require('koa-router')
const send = require('koa-send')

const authUserReply = require('../auth/auth.user.reply')


const indexController = require('../controllers/controller.index.js')
const blogDetailController = require('../controllers/controller.blog.detail.js')
const blogCommitController = require('../controllers/controller.blog.reply.js')
const blogListController = require('../controllers/controller.blog.list.js')
const blogUserController = require('../controllers/controller.blog.user.js')


module.exports = (app)=> {

  //index page render router
  const router = new Router()
  router.get('/', function *() {
    this.type = 'html'
    yield indexController.index.apply(this)
  })


  //restful API server routers
  const {config:{app:{restfulAPI}}}=global
  const api = new Router({prefix: '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion})
  //restful API format
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')(restfulAPI))


  api.get('/blog/article/get', blogDetailController.getArticleDetail)
  api.put('/blog/article/update', blogDetailController.updateArticleDetail)
  api.get('/blog/article/list', blogListController.getArticleList)

  api.get('/blog/reply/get', blogCommitController.getArticleReply)
  api.post('/blog/reply/add', authUserReply.isUserReplyAuthenticated(), blogCommitController.addArticleReply)

  //TODO Test Token
  api.post('/blog/user/add', blogUserController.addUser)

  // Apply all router server
  app.use(router.routes())
  app.use(api.routes())
}
