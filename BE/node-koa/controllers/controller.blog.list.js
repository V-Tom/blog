'use strict'
const {blogCoon}=require('../mongoConfig')

const articleDetailCoon = blogCoon.model('articleDetail')
const redisPrefix = "BLOG_LIST_REDIS_PREFIX"


exports.getArticleList = function *() {
  let {limit, page}=this.query

  limit = Number(limit)
  page = Number(page)

  if (!isNaN(limit) && !isNaN(page)) {
    const key = `${redisPrefix}:articleList${page}-${limit}`
    let list = yield global.redis.get(key)
    if (list) {
      this.APIStatus = 1
      this.APICached = "REDIS"
      list = JSON.parse(list)
    } else {
      const select = ["articleId", "title", "tags", "subtitle", "preview", "meta", "_id"]

      list = yield articleDetailCoon.find()
        .skip(limit * (page - 1)).limit(limit)
        .select(select.join(" ")).lean().exec()
      if (list) {
        yield global.redis.set(key, list)
        this.APIStatus = 1
      } else {
        list = null
        this.APIStatus = 1
      }
    }
    this.body = list
  } else {
    this.APIStatus = 0
    this.APIError = `API router query limit:${limit} or page:${page} must both is Number`
  }
}
