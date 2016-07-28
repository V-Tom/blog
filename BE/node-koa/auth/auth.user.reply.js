'use strict';
const jwt = require('jsonwebtoken')
const {signToken, verifyToken}=require('./auth.token')
const {findUser}=require('../controllers/controller.blog.user')


function isUserReplyAuthenticated() {
  return function *(next) {
    let token, userId

    if (this.request.query && this.request.query.token) {
      token = this.request.query.token
    } else if (this.get('token')) {
      token = this.get('token')
    } else {
      token = this.cookies.get('token')
    }
    if (!token) {
      this.status = 401
      return
    }

    try {
      userId = verifyToken(token)
    } catch (ex) {
      if (ex.name === "TokenExpiredError") {
        this.APIStatus = 2
        return
      }
    }
    const user = yield findUser(userId)

    if (!user) {
      this.status = 401
      return
    }
    yield next
  }
}

exports.isUserReplyAuthenticated = isUserReplyAuthenticated