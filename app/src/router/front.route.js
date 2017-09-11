'use strict'
const Router = require('koa-router')

const { frontCacheController } = require('../controllers')
const { authAdmin } = require('../authenticated')

module.exports = prefix => {

  /**
   * front config cache
   */
  const api = new Router({ prefix })

  api.put('/front/setfrontstatic', authAdmin.userAdminAuthenticated(), frontCacheController.updateConfigCache)

  /**
   * restful API format
   */
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  return api

}
