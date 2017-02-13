'use strict'
const { blogCoon }=require('../config/mongo/mongoConfig')

const blogArticleDetailCoon = blogCoon.model('blogArticleDetail')
const redisPrefix = "BLOG_LIST_REDIS_PREFIX"


exports.getArticleList = function *() {
  let { limit, page, tag }=this.query

  limit = Number(limit)
  page = Number(page)
  if (!isNaN(limit) && !isNaN(page)) {
    const key = `${redisPrefix}:articleList?page=${page}&limit=${limit}${tag ? `tag=${tag}` : ''}`
    let list = yield redis.getCache(key)

    if (list) {
      this.APICached = true
    } else {
      const select = ["articleId", "title", "tags", "subTitle", "intro", "meta", "_id"]
      let query = tag ? { 'tags': { $in: [tag] } } : {}
      let count = yield blogArticleDetailCoon.count(query)
      let data = yield blogArticleDetailCoon.find(query)
        .skip(limit * (page - 1)).limit(limit)
        .select(select.join(" ")).lean().exec()

      if (data) {
        list = { data, count, limit, page }
        yield redis.setCache(key, list)
      } else {
        list = null
      }
    }
    this.body = list
  } else {
    this.throw(`API query limit:${this.query.limit} or page:${this.query.page} must both provide as Number`, 400)
  }
}
