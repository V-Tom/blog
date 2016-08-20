'use strict'
const { blogCoon }=require('../mongoConfig')

const blogArticleDetailCoon = blogCoon.model('blogArticleDetail')
const redisPrefix = "BLOG_LIST_REDIS_PREFIX"


exports.getArticleList = function *() {
  let { limit, page }=this.query

  limit = Number(limit)
  page = Number(page)
  if (!isNaN(limit) && !isNaN(page)) {
    const key = `${redisPrefix}:articleList${page}-${limit}`
    let list = yield redis.get(key)
    if (list) {
      this.APICached = true
      list = JSON.parse(list)
    } else {
      const select = ["articleId", "title", "tags", "subtitle", "preview", "meta", "_id"]
      list = yield blogArticleDetailCoon.find()
        .skip(limit * (page - 1)).limit(limit)
        .select(select.join(" ")).lean().exec()
      if (list) {
        yield redis.set(key, list)
      } else {
        list = null
      }
    }
    this.body = { data: list, count: 100 }
  } else {
    this.throw(`API query limit:${this.query.limit} or page:${this.query.page} must both provide as Number`, 400)
  }
}
