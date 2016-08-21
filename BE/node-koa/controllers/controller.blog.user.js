'use strict'
const { blogCoon }=require('../mongoConfig')
const { Types:{ ObjectId } }=require('mongoose')

const blogArticleUsersConn = blogCoon.model('blogArticleUsers')
const redisPrefix = "BLOG_USERS_REDIS_PREFIX"

const authToken = require('../authenticated/auth.token')
const { oAuthAccess }=require('../middlewares/middleware.oauth.access')

exports.getToken = function *() {
  let userId = this.request.body.userId
  let token = authToken.signToken({ userId })
  this.cookies.set('token', token)
  this.body = { "token": token }
}

exports.getAdminToken = function *() {
  let token = authToken.signToken({
    "admin": 'NOMAND'
  })
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

exports.findUser = (userId, projection)=>function *() {
  const key = `${redisPrefix}-${userId}`
  let userInfo = yield redis.getCache(key)
  if (userInfo) {
    return userInfo
  }
  userInfo = yield blogArticleUsersConn.findById(new ObjectId(userId), projection).lean().exec()
  yield redis.setCache(key, userInfo)
  return userInfo
}
