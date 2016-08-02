'use strict'
const { blogCoon }=require('../mongoConfig')
const { mongo:{ ObjectId } }=require('mongoose')

const blogArticleDetailCoon = blogCoon.model('blogArticleDetail')
const redisPrefix = "BLOG_DETAIL_REDIS_PREFIX"


exports.getArticleList = function *() {
  let { limit, page }=this.query

  limit = Number(limit)
  page = Number(page)

  if (!isNaN(limit) && !isNaN(page)) {
    const key = `${redisPrefix}:articleList${page}-${limit}`
    let list = yield global.redis.get(key)
    if (list) {
      list = { "success": true, "data": JSON.parse(list), "poweredBy": "REDIS" }
    } else {
      const select = ["articleId", "title", "tags", "subtitle", "preview", "meta", "_id"]

      list = yield blogArticleDetailCoon.find()
        .skip(limit * (page - 1)).limit(limit)
        .select(select.join(" ")).lean().exec()
      if (list) {
        yield global.redis.set(key, list)
        list = { "success": true, "data": list }
      } else {
        list = { "success": true, "data": null }
      }
    }
    this.body = list
  } else {
    this.body = { "success": false, "error": `API router query limit:${limit} or page:${page} must both is Number` }
  }
}

exports.getArticleDetail = function *() {
  const { articleId } = this.query
  const key = `${redisPrefix}:${articleId}`

  let detail = yield global.redis.get(key)
  if (detail) {
    detail = { "success": true, "data": JSON.parse(detail), "poweredBy": "REDIS" }
  } else {
    detail = yield blogArticleDetailCoon.findOne({ "articleId": articleId }).lean().exec()
    if (detail) {
      yield global.redis.set(key, detail)
      detail = { "success": true, "data": detail }
    } else {
      detail = { "success": true, "data": null }
    }
  }
  this.body = detail
}

exports.updateArticleDetail = function *() {

}