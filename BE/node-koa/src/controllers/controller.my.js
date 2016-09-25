'use strict'
const { blogCoon }=require('../config/mongoConfig')
const { mongo:{ ObjectId } }=require('mongoose')

const fs = require('fs')
const path = require('path')

const redisPrefix = "MY_REDIS_PREFIX"

const resumeCachePath = path.join(__dirname, '../../root/Tom\'sresume.md')

/**
 * 得到简历
 */
exports.getMyResume = function *() {
  const resumeRedisPrefix = `${redisPrefix}-resume`
  let resume = yield redis.getCache(resumeRedisPrefix)
  if (!resume) {
    resume = fs.readFileSync(resumeCachePath, 'utf8')
    resume = { data: { resume } }
    yield  redis.setCache(resumeRedisPrefix, resume)
  }
  this.body = resume
}

/**
 * 更新简历
 */
exports.updateMyResume = function *() {
  yield redis.removeCache(redisPrefix)
  let { resume } = this.body
  fs.writeFileSync(resumeCachePath, JSON.stringify({ resume }), 'utf8')
}
