'use strict'
const { getVerifyCode } = require('../lib')
const { uploadFileFromBuffer } = require('./controller.cdn.upload')
const libUniverse = require('../lib').libUniverse

exports.verifyCode = function *() {
  let code = getVerifyCode()
  this.body = {
    data: code
  }
}

exports.tinyPNG = function *() {
  const reqBody = this.request.body

  const { binary, key } = reqBody

  if (global.CONFIG.app.tinyPNG.key && binary) {

    const tinyBuffer = yield libUniverse.tinyUpload(binary)
    const upload = yield libUniverse.uploadFileFromBuffer(tinyBuffer, key)

    this.body = {
      data: upload
    }
  } else {
    this.body = {
      data: null
    }
  }
}