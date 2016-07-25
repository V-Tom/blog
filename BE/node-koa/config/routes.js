'use strict';
const Router = require('koa-router')
const send = require('koa-send')
const auth = require('../auth/auth.commit.server')

const indexController = require('../controllers/index.controller')
const blogDetailController = require('../controllers/blog.detail.controller')


const apiPrefix = "/api"
const apiVersion = '/v1'

module.exports = (app)=> {

  //index page render router
  const router = new Router()
  router.get('/', function *() {
    this.type = 'html'
    yield indexController.index.apply(this)
  })


  //api server routers
  const api = new Router({prefix: apiPrefix + apiVersion});

  api.get('/blog/article/get', blogDetailController.getArticleDetail)

  // Apply all router server
  app.use(router.routes())
  app.use(api.routes());
}
