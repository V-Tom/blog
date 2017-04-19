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

//TODO remove canvas for docker
// const libToolCanvas = require('./lib.tool.canvas')
// exports.getVerifyCode = libToolCanvas.index

const libGenerateArticleId = require('./lib.tool.generateArticleId')
const libUpdateGithubArticleRepo = require('./lib.tools.updateGithubArtcleRepo')

exports.getVerifyCode = function () {
  return {
    base64: null,
    code: undefined
  }
}

exports.generateArticleId = libGenerateArticleId.index
exports.updateArticleRepo = libUpdateGithubArticleRepo.index
exports.libUniverse = require('./lib.tool.universe')