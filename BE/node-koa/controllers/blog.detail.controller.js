'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const articleDetailCoon = blogCoon.model('articleDetail')
const redisPrefix = "BLOG_DETAIL_REDIS_PREFIX"

const {config:{app:{restfulAPI:{RESPONSE_SUCCESS, RESPONSE_ERROR}}}}=global

exports.getArticleDetail = function *() {
  const id = this.query.articleId
  const key = `${redisPrefix}:${id}`

  let detail = yield global.redis.get(key)
  if (!detail) {
    detail = yield articleDetailCoon.findOne({"articleId": id}).exec()
    if (detail) {
      detail = Object.assign(RESPONSE_SUCCESS, {"data": detail._doc})
      detail = yield global.redis.set(key, detail)
    } else {
      detail = Object.assign(RESPONSE_SUCCESS, {"data": null})
    }
  } else {
    detail = Object.assign(JSON.parse(detail), {"poweredBy": "REDIS"})
  }
  this.body = detail
}

exports.updateArticleDetail = function *() {

}