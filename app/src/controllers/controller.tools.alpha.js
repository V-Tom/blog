'use strict'
const { getVerifyCode } = require('../lib')
exports.verifyCode = function *() {
  let code = getVerifyCode()
  this.body = {
    data: code
  }
}

exports.test = function *() {

}