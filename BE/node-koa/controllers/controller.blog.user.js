'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const blogUsersConn = blogCoon.model('blogUsers')
const redisPrefix = "BLOG_USERS_REDIS_PREFIX"

const {signToken} = require('../auth/auth.token')

exports.addUser = function *() {
  let userId = this.request.body.userId
  let token = signToken(userId)
  this.cookies.set('token', token)
  this.body = {"token": token}
}

exports.updateUser = function *() {

}

exports.findUser = (userId)=>function *() {
  blogUsersConn.findById(userId).lean().exec()
}
