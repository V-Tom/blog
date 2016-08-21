'use strict'
const { blogCoon }=require('../mongoConfig')
const { mongo:{ ObjectId } }=require('mongoose')

const blogArticleDetailCoon = blogCoon.model('blogArticleDetail')
const redisPrefix = "BLOG_DETAIL_REDIS_PREFIX"


exports.getArticleDetail = function *() {
  const { articleId } = this.query
  const key = `${redisPrefix}:${articleId}`

  let detail = yield redis.getCache(key)
  if (detail) {
    this.APICached = true
  } else {
    detail = yield blogArticleDetailCoon.findOne({ "articleId": articleId }).lean().exec()
    if (detail) {
      yield redis.setCache(key, detail)
    } else {
      detail = null
    }
  }
  this.body = { data: detail }
}

exports.updateArticleDetail = function *() {

}

exports.createArticle = function *() {

}

exports.deleteArticle = function *() {

}