'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const articleDetailCoon = blogCoon.model('articleDetail')
const redisPrefix = "BLOG_DETAIL_REDIS_PREFIX"


exports.getArticleDetail = function *() {
  const id = this.query.articleId
  const key = `${redisPrefix}:${id}`

  let detail = yield global.redis.get(key)
  if (!detail) {
    detail = yield articleDetailCoon.findOne({"articleId": id}).exec()
    if (detail) {
      detail = yield global.redis.set(key, detail._doc)
      detail["poweredBy"] = "REDIS"
      this.body = detail
    }
  }
  this.body = detail
}

exports.updateArticleDetail = function *() {

}