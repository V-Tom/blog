'use strict'
const Router = require('koa-router')

const { myController } = require('../controllers')
const { authAdmin } = require('../authenticated')

module.exports = prefix => {

  /**
   * blog article list
   */
  const api = new Router({ prefix })

  /**
   * resume
   */
  api.get('/my/resume', myController.getMyResume)
  api.put('/my/resume', authAdmin.userAdminAuthenticated(), myController.updateMyResume)

  /**
   * my articleRepo
   */
  api.post('/my/articleRepo', authAdmin.userAdminAuthenticated(), myController.pushArticleRepo)

  /**
   * restful API format
   */
  api.use(require('../middlewares/middlewares.restfulAPI.response.js')())

  return api

}
