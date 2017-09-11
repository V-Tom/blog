'use strict'
const Router = require('koa-router')

const { blogArticleController } = require('../controllers')
const { authAdmin } = require('../authenticated')

module.exports = prefix => {

  /**
   * blog article
   */

  const api = new Router({ prefix })

  api.post('/blog/article', authAdmin.userAdminAuthenticated(), blogArticleController.createArticle)
  api.get('/blog/article/:articleId', blogArticleController.getArticleDetail)
  api.put('/blog/article/:articleId', authAdmin.userAdminAuthenticated(), blogArticleController.updateArticleDetail)
  api.del('/blog/article/:articleId/:_id', authAdmin.userAdminAuthenticated(), blogArticleController.deleteArticle)

  /**
   * restful API format
   */
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  return api
}
