'use strict'

module.exports = {
  indexController: require('../controllers/controller.index.js'),
  blogDetailController: require('../controllers/controller.blog.detail.js'),
  blogListController: require('../controllers/controller.blog.list.js'),
  blogUserController: require('../controllers/controller.blog.user.js'),
  cdnUploadController: require('../controllers/controller.cdn.upload'),
  frontCacheController: require('./../lib/lib.front.cache.js'),
  myController: require('./controller.my')
}