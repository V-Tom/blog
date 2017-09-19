'use strict'
const Router = require('koa-router')

const { webPushController } = require('../controllers')
const { authAdmin } = require('../authenticated')

module.exports = prefix => {

  /**
   * blog article list
   */
  const api = new Router({ prefix })

  const localAPI = '/webpush'

  api.post(`${localAPI}/subscribe`, webPushController.subscribe)

  api.post(`${localAPI}/broadcast`, authAdmin.userAdminAuthenticated(), webPushController.broadcast)


  /**
   * restful API format
   */
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  return api
}
