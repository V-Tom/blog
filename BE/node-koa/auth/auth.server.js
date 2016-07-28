'use strict';
const jwt = require('jsonwebtoken')
const {blogCoon}=require('../mongoConfig')
const request = require('request');


function signToken(user) {
  return jwt.sign({
    id: user.id
  }, global.config.app.tokenSecret, {
    expiresIn: global.config.app.tokenExpireTime
  })
}

function verifyToken(token) {
  return jwt.verify(token, global.config.app.tokenSecret)
}
//isAuthenticated
function isAuthenticated() {
  return function *(next) {
    let token
    if (this.request.query && this.request.query.token) {
      token = this.request.query.token
    } else if (this.get('token')) {
      token = this.get('token')
    }
    const userId = verifyToken(token)._id
    const user = yield commitUser.findById(userId).exec()

    if (!user) {
      this.response.status = 401
      return
    }

    this.user = user
    yield next
  }
}

exports.isAuthenticated = isAuthenticated
exports.userLoginAuthenticated = isAuthenticated
exports.signToken = signToken
exports.verifyToken = verifyToken