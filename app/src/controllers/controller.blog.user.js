'use strict'
const { blogCoon } = require('../config/mongo/mongoConfig')
const { Types: { ObjectId } } = require('mongoose')
const blogArticleUsersModel = blogCoon.model('blogArticleUsers')
const redisPrefix = "BLOG_USERS_REDIS_PREFIX"
const authToken = require('../authenticated/auth.token')

/**
 *
 * 注册一个 admin 账户
 */
exports.getAdminToken = async (ctx, next) => {

  const { secret } = ctx.query

  if (secret === CONFIG.app.token.secret) {
    let token = authToken.signToken(CONFIG.app.token.userId)
    ctx.cookies.set('token', token)
    ctx.body = { "token": token }
    return next()
  } else {
    ctx.throw(401, 'admin user secret illegal')
  }
}

/**
 * 根据用户id 查找用户
 * @param userId
 * @param projection
 */
exports.findUser = async (userId, projection = {}) => {
  let userInfo

  const key = `${redisPrefix}-${userId}`

  userInfo = await REDIS.getCache(key)
  if (userInfo) {
    return userInfo
  }
  userInfo = await blogArticleUsersModel
    .findById(new ObjectId(userId), projection)
    .lean()
    .exec()

  await REDIS.setCache(key, userInfo)
  return userInfo
}

/**
 * 从 用户 cookies 上获取一次token 后重新生成一次
 * JSONP
 */
exports.sign = async (ctx, next) => {
  let callback = ctx.query.callback
  if (!callback) return

  let token = ctx.cookies.get('token')
  ctx.type = 'text/javascript'
  ctx.APIDonotFormat = true

  if (!token) {
    ctx.body = callback + '(' + JSON.stringify({ status: 401, msg: 'You might not login,please login' }) + ')'
    return
  }

  let userInfo
  try {
    userInfo = authToken.verifyToken.call(ctx, token)
  } catch ( e ) {
    ctx.body = callback + '(' + JSON.stringify({ status: 401, msg: 'You might not login,please login' }) + ')'
    return
  }
  let newToken = authToken.signToken(userInfo.userId)


  ctx.body = callback + '(' + JSON.stringify({ status: 0, token: newToken }) + ')'
}
