'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const commitListCoon = blogCoon.model('commitList')
const redisPrefix = "BLOG_COMMIT_REDIS_PREFIX"


exports.getArticleCOMMIT = function *() {
  const id = this.query.articleId
  const key = `${redisPrefix}:${id}`

  let commitList = yield global.redis.get(key)
  if (!commitList) {
    commitList = yield commitListCoon.find({"articleId": id}).exec()
    if (commitList) {
      commitList = yield global.redis.set(key, commitList._doc)
      commitList["poweredBy"] = "REDIS"
      this.body = {success: true, data: commitList}
    } else {
      commitList = null
    }
  }
  this.body = commitList
}

exports.updateArticleDetail = function *() {

}