'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const commitListCoon = blogCoon.model('commitList')
const redisPrefix = "BLOG_COMMIT_REDIS_PREFIX"

const {config:{app:{restfulAPI:{RESPONSE_SUCCESS, RESPONSE_ERROR}}}}=global

exports.getArticleCOMMIT = function *() {
  const {articleId} = this.query
  const key = `${redisPrefix}:${articleId}`

  let commitList = yield global.redis.get(key)
  if (commitList) {
    commitList = {"success": true, "data": JSON.parse(commitList), "poweredBy": "REDIS"}
  } else {
    commitList = yield commitListCoon.find({"articleId": articleId}).lean().exec()
    if (commitList) {
      yield global.redis.set(key, commitList)
      commitList = {"success": true, "data": commitList}
    } else {
      commitList = {"success": true, "data": null}
    }
  }
  this.body = commitList
}

exports.updateArticleDetail = function *() {

}