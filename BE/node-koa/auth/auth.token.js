'use strict';
const jwt = require('jsonwebtoken')


function signToken(userId) {
  return jwt.sign({
    userId
  }, global.config.app.tokenSecret, {
    expiresIn: global.config.app.tokenExpireTime
  })
}


function verifyToken(token) {
  return jwt.verify(token, global.config.app.tokenSecret)
}


exports.signToken = signToken
exports.verifyToken = verifyToken