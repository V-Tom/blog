'use strict'
const { blogCoon } = require('../config/mongo/mongoConfig')
const { Types: { ObjectId } } = require('mongoose')
const blogArticleUsersModel = blogCoon.model('blogArticleUsers')
const authToken = require('../authenticated/auth.token')
const redisPrefix = "BLOG_USERS_REDIS_PREFIX"


/**
 * 注册一个简单的用户账户
 */
exports.getUserToken = function *() {
  let userId = this.request.body.userId
  let token = authToken.signToken(userId)
  this.cookies.set('token', token)
  this.body = { "token": token }
}

/**
 *
 * 注册一个 admin 账户
 */
exports.getAdminToken = function *() {
  const { secret } = this.query
  if (secret === CONFIG.app.token.secret) {
    let token = authToken.signToken(CONFIG.app.token.userId)
    this.cookies.set('token', token)
    this.body = { "token": token }
  } else {
    this.throw(401, 'admin user secret illegal')
  }
}

/**
 * 根据用户id 查找用户
 * @param userId
 * @param projection
 */
exports.findUser = (userId, projection) => function *() {
  const key = `${redisPrefix}-${userId}`
  let userInfo = yield REDIS.getCache(key)
  if (userInfo) {
    return userInfo
  }
  userInfo = yield blogArticleUsersModel.findById(new ObjectId(userId), projection).lean().exec()
  yield REDIS.setCache(key, userInfo)
  return userInfo
}

/**
 * 从 用户 cookies 上获取一次token 后重新生成一次
 * JSONP
 */
exports.sign = function *() {
  let callback = this.query.callback
  if (!callback) return

  let token = this.cookies.get('token')
  this.type = 'text/javascript'
  this.APIDonotFormat = true

  if (!token) {
    this.body = callback + '(' + JSON.stringify({ status: 401, msg: 'You might not login,please login' }) + ')'
    return
  }

  let userInfo
  try {
    userInfo = authToken.verifyToken.call(this, token)
  } catch ( e ) {
    this.body = callback + '(' + JSON.stringify({ status: 401, msg: 'You might not login,please login' }) + ')'
    return
  }
  let newToken = authToken.signToken(userInfo.userId)


  this.body = callback + '(' + JSON.stringify({ status: 0, token: newToken }) + ')'
}
