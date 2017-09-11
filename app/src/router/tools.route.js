'use strict'
const Router = require('koa-router')

const { cdnUploadController } = require('../controllers')
const { authAdmin } = require('../authenticated')

module.exports = prefix => {


  /**
   * CDN
   */
  const api = new Router({ prefix })

  api.get('/tools/cdn/upload', authAdmin.userAdminAuthenticated(), cdnUploadController.uploadFileToken)

  /**
   * restful API format
   */
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  return api
}
