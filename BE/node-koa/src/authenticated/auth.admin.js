'use strict';
const jwt = require('jsonwebtoken')
const { signToken, verifyToken }=require('./auth.token')
const { findUser }=require('../controllers/controller.blog.user')


function userAdminAuthenticated() {
  return function *(next) {
    let token, userInfo

    if (this.request.query && this.request.query.token) {
      token = this.request.query.token
    } else if (this.get('token')) {
      token = this.get('token')
    } else {
      token = this.cookies.get('token')
    }
    if (!token) {
      this.throw(401, 'Token expired. You must login again')
    }

    userInfo = verifyToken(token)


    if (!userInfo.userId) {
      this.throw(401, 'Token illegal')
    }

    let user = yield findUser(userInfo.userId)

    if (!user) {
      this.throw(401, 'Token illegal')
    }

    if (user.email === 'iamnomand@gmail.com') {
      this._adminUser = user
      yield next
    } else {
      this.throw(401, 'Token illegal')
    }
  }
}

exports.userAdminAuthenticated = userAdminAuthenticated