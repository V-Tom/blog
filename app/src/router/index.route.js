'use strict'
const Router = require('koa-router')
const { indexController } = require('../controllers')

module.exports = _ => {

  /**
   * front config cache
   */
  const api = new Router()

  api.get('/', indexController.renderIndexView)

  return api
}
