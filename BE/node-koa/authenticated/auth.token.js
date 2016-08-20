'use strict';
const jwt = require('jsonwebtoken')


function signToken(tokenInfo) {
  return jwt.sign(tokenInfo, config.app.tokenSecret, {
    expiresIn: config.app.tokenExpireTime
  })
}


function verifyToken(token) {
  return jwt.verify(token, config.app.tokenSecret)
}


exports.signToken = signToken
exports.verifyToken = verifyToken