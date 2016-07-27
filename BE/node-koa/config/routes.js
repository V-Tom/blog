'use strict';
const Router = require('koa-router')
const send = require('koa-send')
const auth = require('../auth/auth.commit.server')

const indexController = require('../controllers/index.controller')
const blogDetailController = require('../controllers/blog.detail.controller')
const blogCommitController = require('../controllers/blog.commit.controller')

const {config:{app:{restfulAPI}}}=global

module.exports = (app)=> {

  //index page render router
  const router = new Router()
  router.get('/', function *() {
    this.type = 'html'
    yield indexController.index.apply(this)
  })


  //restful API server routers
  const api = new Router({prefix: '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion})

  api.use(function *(next) {
    yield next

    //set API type
    this.type = "application/json"

    //restful API response format
    this.body && (this.body.success ? (this.body = Object.assign({}, restfulAPI.RESPONSE_SUCCESS, this.body)) :
      this.body = Object.assign({}, restfulAPI.RESPONSE_ERROR, this.body))
  })

  api.get('/blog/article/get', blogDetailController.getArticleDetail)
  api.get('/blog/article/list', blogDetailController.getArticleList)
  api.put('/blog/article/update', blogDetailController.updateArticleDetail)

  api.get('/blog/reply/get', blogCommitController.getArticleCOMMIT)
  api.post('/blog/reply/add', auth.isCommitAccess)

  // Apply all router server
  app.use(router.routes())
  app.use(api.routes())
}
