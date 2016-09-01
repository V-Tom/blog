'use strict'

module.exports = {
  indexController: require('../controllers/controller.index.js'),
  blogDetailController: require('../controllers/controller.blog.detail.js'),
  blogCommitController: require('../controllers/controller.blog.reply.js'),
  blogListController: require('../controllers/controller.blog.list.js'),
  blogUserController: require('../controllers/controller.blog.user.js'),
  cdnUploadController: require('../controllers/controller.cdn.upload'),
  toolsController: require('../controllers/controller.tools.alpha'),
  frontCacheController: require('./controller.front.cache')
}