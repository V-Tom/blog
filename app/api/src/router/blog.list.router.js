'use strict'
const Router = require('koa-router')

const { blogListController } = require('../controllers')

module.exports = prefix => {

  /**
   * blog article list
   */
  const api = new Router({ prefix })

  api.get('/blog/list', blogListController.getArticleList)

  /**
   * restful API format
   */
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  return api

}
