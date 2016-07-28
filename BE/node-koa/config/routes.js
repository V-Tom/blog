'use strict';
const Router = require('koa-router')
const send = require('koa-send')
const auth = require('../auth/auth.server')

const indexController = require('../controllers/index.controller')
const blogDetailController = require('../controllers/blog.detail.controller')
const blogCommitController = require('../controllers/blog.commit.controller')
const blogListController = require('../controllers/blog.list.controller')

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
  api.use(require('../middlewares/restfulAPI.response.middlewares')(restfulAPI))


  api.get('/blog/article/get', blogDetailController.getArticleDetail)
  api.put('/blog/article/update', blogDetailController.updateArticleDetail)

  api.get('/blog/article/list', blogListController.getArticleList)

  api.get('/blog/reply/get', blogCommitController.getArticleCommit)
  api.post('/blog/reply/add', auth.isUserLoginAuth, blogCommitController.addArticleCommit)

  // Apply all router server
  app.use(router.routes())
  app.use(api.routes())
}
