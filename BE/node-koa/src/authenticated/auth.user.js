'use strict';
const jwt = require('jsonwebtoken')
const { signToken, verifyToken }=require('./auth.token')
const { findUser }=require('../controllers/controller.blog.user')


function userReplyAuthenticated() {
  return function *(next) {
    let token, userInfo

    //url query
    if (this.request.query && this.request.query.token) {
      token = this.request.query.token
    } else if (this.get('token')) {
      //body
      token = this.get('token')
    } else {
      //cookie
      token = this.cookies.get('token')
    }
    if (!token) {
      this.throw(401, 'This method must be have token on querySting or body or cookies')
    }

    userInfo = verifyToken(token)

    let { userId }=userInfo
    if (!userId) {
      this.throw(401, 'Token illegal')
    }
    const user = yield findUser(userId)

    if (!user) {
      this.throw(401, 'Token illegal')
    }
    this._user = user
    yield next
  }
}

exports.userReplyAuthenticated = userReplyAuthenticated