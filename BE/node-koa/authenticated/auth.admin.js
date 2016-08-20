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
      this.throw('Token expired. You must login again', 401)
      return
    }

    try {
      userInfo = verifyToken(token)
    } catch ( ex ) {
      if (ex.name === "TokenExpiredError") {
        this.throw('Token expired. You must login again', 401)
        return
      } else {
        this.throw('Token illegal', 401)
      }
    }
    if (userInfo.admin === 'NOMAND') {
      yield next
    } else {
      this.throw('Token illegal', 401)
    }
  }
}

exports.userAdminAuthenticated = userAdminAuthenticated