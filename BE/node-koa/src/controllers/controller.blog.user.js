'use strict'
const { blogCoon }=require('../config/mongoConfig')
const { Types:{ ObjectId } }=require('mongoose')

const blogArticleUsersModel = blogCoon.model('blogArticleUsers')
const redisPrefix = "BLOG_USERS_REDIS_PREFIX"

const authToken = require('../authenticated/auth.token')
const { oAuthAccess }=require('../middlewares/middleware.oauth.access')
const { renderAuthLoginView }=require('./controller.index')

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
 * 注册一个 admin 账户
 */
exports.getAdminToken = function *() {
  let token = authToken.signToken('57a8bc5f6adacd66d9168fee')
  this.cookies.set('token', token)
  this.body = { "token": token }
}

/**
 * 添加新的用户
 */
exports.addUser = function *() {

}

/**
 * 更新用户信息
 */
exports.updateUser = function *() {
  let { code, state } = this.query
  try {
    let userInfo = yield oAuthAccess(state, code)
    let platformUser = {
      userType: state,
      userDetail: userInfo
    }
    let newUser = new blogArticleUsersModel(platformUser)
    yield newUser.save()
    this.cookies.set('token', authToken.signToken(String(newUser._id)), {
      expires: new Date(Date.now() + config.app.cookies.expires),
      httpOnly: true
    })
    this.APIDontFormat = true
    yield renderAuthLoginView.call(this, JSON.stringify(platformUser))

  } catch ( ex ) {
    this.throw(500, ex.message)
  }
}

/**
 * 根据用户id 查找用户
 * @param userId
 * @param projection
 */
exports.findUser = (userId, projection)=>function *() {
  const key = `${redisPrefix}-${userId}`
  let userInfo = yield redis.getCache(key)
  if (userInfo) {
    return userInfo
  }
  userInfo = yield blogArticleUsersModel.findById(new ObjectId(userId), projection).lean().exec()
  yield redis.setCache(key, userInfo)
  return userInfo
}

/**
 * 从 用户 cookies 上获取一次token 后重新生成一次
 */
exports.sign = function *() {
  let token = this.cookies.get('token')
  if (!token) {
    this.throw(401, 'You might not login,please login.')
  }

  let userInfo = authToken.verifyToken(token)
  let newToken = authToken.signToken(userInfo.userId)

  this.body = { data: { token: newToken } }
}
