'use strict'
const { blogCoon } = require('../config/mongo/mongoConfig')
const { mongo: { ObjectId } } = require('mongoose')
const updateArticleRepoTool = require('../lib/lib.tools.updateGithubArtcleRepo')
const fs = require('fs')
const path = require('path')

const redisPrefix = "MY_REDIS_PREFIX"

const resumeCachePath = path.join(__dirname, '../../root/Tom\'sresume.md')

/**
 * 得到简历
 */
exports.getMyResume = function *() {
  const resumeRedisPrefix = `${redisPrefix}-resume`
  let resume = yield REDIS.getCache(resumeRedisPrefix)
  if (!resume) {
    resume = fs.readFileSync(resumeCachePath, 'utf8')
    resume = { data: { resume } }
    yield  REDIS.setCache(resumeRedisPrefix, resume)
  }
  this.body = resume
}

/**
 * 更新简历
 */
exports.updateMyResume = function *() {
  yield REDIS.removeCache(redisPrefix)
  let { resume } = this.body
  fs.writeFileSync(resumeCachePath, JSON.stringify({ resume }), 'utf8')
}

/**
 * 更新repo
 */
exports.pushArticleRepo = function *() {
  try {
    updateArticleRepoTool.push()
  } catch ( e ) {
    this.throw(500, e)
  }
}