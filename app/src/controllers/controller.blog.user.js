'use strict'
const { blogCoon } = require('../config/mongo/mongoConfig')
const { Types: { ObjectId } } = require('mongoose')

const blogArticleUsersModel = blogCoon.model('blogArticleUsers')
const redisPrefix = "BLOG_USERS_REDIS_PREFIX"

const authToken = require('../authenticated/auth.token')
const { oAuthAccess } = require('../middlewares/middleware.oauth.access')
const { renderAuthLoginView } = require('./controller.index')

/**
 * 注册一个简单的用户账户
 */
exports.getUserToken = async ctx => {
  let userId = ctx.request.body.userId
  let token = authToken.signToken(userId)
  ctx.cookies.set('token', token)
  ctx.body = { "token": token }
}

/**
 *
 * 注册一个 admin 账户
 */
exports.getAdminToken = async ctx => {
  let { secret } = ctx.query
  if (secret === config.app.secret.admin) {
    let token = authToken.signToken('57a8bc5f6adacd66d9168fee')
    ctx.cookies.set('token', token)
    ctx.body = { "token": token }
  } else {
    ctx.throw(401, 'admin user secret illegal')
  }
}

/**
 * TODO
 * 添加新的用户
 */
exports.addUser = async ctx => {

}

/**
 * 更新用户信息
 */
exports.updateUser = async ctx => {
  let { code, state } = ctx.query
  try {
    let userInfo = await oAuthAccess(state, code)
    let platformUser = {
      userType: state,
      userDetail: userInfo
    }
    let newUser = new blogArticleUsersModel(platformUser)
    await newUser.save()
    ctx.cookies.set('token', authToken.signToken(String(newUser._id)), {
      expires: new Date(Date.now() + config.app.cookies.expires),
      httpOnly: true
    })
    ctx.APIDontFormat = true
    await renderAuthLoginView.call(ctx, platformUser)

  } catch ( ex ) {
    ctx.throw(500, ex.message)
  }
}

/**
 * 根据用户id 查找用户
 * @param userId
 * @param projection
 */
exports.findUser = (userId, projection) => async ctx => {
  const key = `${redisPrefix}-${userId}`
  let userInfo = await redis.getCache(key)
  if (userInfo) {
    return userInfo
  }
  userInfo = await blogArticleUsersModel.findById(new ObjectId(userId), projection).lean().exec()
  await redis.setCache(key, userInfo)
  return userInfo
}

/**
 * 从 用户 cookies 上获取一次token 后重新生成一次
 * JSONP
 */
exports.sign = async ctx => {
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
