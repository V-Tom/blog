'use strict'
const { blogCoon }=require('../mongoConfig')
const { mongo:{ ObjectId } }=require('mongoose')

const blogArticleUsersConn = blogCoon.model('blogArticleUsers')
const redisPrefix = "BLOG_USERS_REDIS_PREFIX"

const { signToken } = require('../auth/auth.token')
const { oAuthAccess }=require('../middlewares/middleware.oauth.access')

exports.getToken = function *() {
  let userId = this.request.body.userId
  let token = signToken(userId)
  this.cookies.set('token', token)
  this.body = { "token": token }
}

exports.addUser = function *() {

}

exports.updateUser = function *() {
  let { code, state } = this.query
  try {
    let userInfo = yield oAuthAccess(state, code)
    let newUser = new blogArticleUsersConn({
      userType: state,
      userDetail: userInfo
    })
    yield newUser.save()
  } catch ( ex ) {
    console.log(ex)
  }
}

exports.findUser = (userId)=>function *() {
  blogArticleUsersConn.findById(userId).lean().exec()
}
