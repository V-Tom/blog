'use strict';
const jwt = require('jsonwebtoken')


function signToken(userId) {
  return jwt.sign({ userId }, CONFIG.app.token.secret, {
    expiresIn: CONFIG.app.token.expires
  })
}


function verifyToken(token) {
  let userInfo
  try {
    userInfo = jwt.verify(token, CONFIG.app.token.secret)
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