'use strict';
const jwt = require('jsonwebtoken')


function signToken(userId) {
  return jwt.sign({ userId }, APP.token.secret, {
    expiresIn: APP.token.expires
  })
}


function verifyToken(token) {
  let userInfo
  try {
    userInfo = jwt.verify(token, APP.token.secret)
  } catch ( ex ) {
    if (ex.name === "TokenExpiredError") {
      this.throw(401, 'Token expired. You must login again')
    } else {
      this.throw(401, 'Token illegal !')
    }
  }
  return userInfo
}


exports.signToken = signToken
exports.verifyToken = verifyToken