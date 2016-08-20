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
      this.throw('401', 'This method must be have token on querySting or body or cookies')
    }

    try {
      userInfo = verifyToken(token)
    } catch ( ex ) {
      if (ex.name === "TokenExpiredError") {
        this.throw('4')
      } else {
        this.throw('Token illegal !', 401)
      }
    }
    let { userId }=userInfo
    if (!userId) {
      this.throw('Token illegal !', 401)
    }
    const user = yield findUser(userId)

    if (!user) {
      this.throw('Token illegal', 401)
    }
    this._user = user
    yield next
  }
}

exports.userReplyAuthenticated = userReplyAuthenticated