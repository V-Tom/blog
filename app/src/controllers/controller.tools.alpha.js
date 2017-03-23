'use strict'
const { getVerifyCode } = require('../lib')
/**
 * verify code
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.verifyCode = async (ctx, next) => {
  let code = getVerifyCode()
  ctx.body = {
    data: code
  }
  return next()
}

exports.test = async (ctx, next) => {
  ctx.body = 'hello there'
  return next()
}