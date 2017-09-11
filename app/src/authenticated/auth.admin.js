'use strict';
const jwt = require('jsonwebtoken')
const { signToken, verifyToken } = require('./auth.token')
const { findUser } = require('../controllers/controller.blog.user')


function userAdminAuthenticated() {
  return async (ctx, next) => {
    let token, userInfo

    if (ctx.request.query && ctx.request.query.token) {
      token = ctx.request.query.token
    } else if (ctx.get('token')) {
      token = ctx.get('token')
    } else {
      token = ctx.cookies.get('token')
    }
    if (!token) {
      ctx.throw(401, 'Token expired. You must login again')
    }

    userInfo = verifyToken.call(ctx, token)

    if (!userInfo.userId) {
      ctx.throw(401, 'Token illegal')
    }

    let user = await findUser(userInfo.userId)

    if (!user) {
      ctx.throw(401, 'Token illegal. can\'t find ctx admin user')
    }

    if (user.detail && user.detail.email === CONFIG.app.token.email) {
      ctx._adminUser = user
      return next()
    } else {
      ctx.throw(401, 'Token illegal. ctx user email is\'nt verify')
    }
  }
}

exports.userAdminAuthenticated = userAdminAuthenticated