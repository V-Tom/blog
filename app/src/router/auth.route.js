'use strict'
const Router = require('koa-router')

const { blogUserController } = require('../controllers')
const { authAdmin } = require('../authenticated')

module.exports = prefix => {

  /**
   * auth
   */
  const api = new Router({ prefix })

  api.post('/auth/user/admin', blogUserController.getAdminToken)

  /**
   * restful API format
   */
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  return api

}
