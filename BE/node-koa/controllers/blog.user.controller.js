'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const blogUsersConn = blogCoon.model('blogUsers')
const redisPrefix = "BLOG_USERS_REDIS_PREFIX"


exports.addUser = function *() {

}

exports.updateUser = function *() {

}

exports.getUser = function *() {

}
