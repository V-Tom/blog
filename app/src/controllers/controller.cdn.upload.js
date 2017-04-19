'use strict'
const libUniverse = require('../lib').libUniverse

/**
 * get upload token
 */
exports.uploadFileToken = function *() {
  const token = libUniverse.getUploadToken()
  this.body = {
    url: 'http://up.qiniu.com/',
    token: token
  }
}