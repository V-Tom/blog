//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
'use strict'
const indexController = require('../controllers/controller.index.js')
const blogDetailController = require('../controllers/controller.blog.detail.js')
const blogCommitController = require('../controllers/controller.blog.reply.js')
const blogListController = require('../controllers/controller.blog.list.js')
const blogUserController = require('../controllers/controller.blog.user.js')
const cdnUploadController = require('../controllers/controller.cdn.upload')
const toolsController = require('../controllers/controller.tools.alpha')
module.exports = {
  indexController,
  blogDetailController,
  blogCommitController,
  blogListController,
  blogUserController,
  cdnUploadController,
  toolsController
}