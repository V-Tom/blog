'use strict';
const jwt = require('jsonwebtoken')


function signToken(userId) {
  return jwt.sign({ userId }, config.app.token.secret, {
    expiresIn: config.app.token.expires
  })
}


function verifyToken(token) {
  let userInfo
  try {
    userInfo = jwt.verify(token, config.app.token.secret)
  } catch ( ex ) {
    if (ex.name === "TokenExpiredError") {
      this.throw(401, 'Token expired. You must login again')
    } else {
      this.throw(401, 'jwt verifyToken error !')
    }
  }
  return userInfo
}

exports.signToken = signToken
exports.verifyToken = verifyToken