'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const blogArticleReplyCoon = blogCoon.model('blogArticleReply')
const redisPrefix = "BLOG_COMMIT_REDIS_PREFIX"


exports.getArticleReply = function *() {
  const {articleId} = this.query
  const key = `${redisPrefix}:${articleId}`

  let replyList = yield global.redis.get(key)
  if (replyList) {
    replyList = {"success": true, "data": JSON.parse(replyList), "poweredBy": "REDIS"}
  } else {
    replyList = yield blogArticleReplyCoon.find({"articleId": articleId}).lean().exec()
    if (replyList) {
      yield global.redis.set(key, replyList)
      replyList = {"success": true, "data": replyList}
    } else {
      replyList = {"success": true, "data": null}
    }
  }
  this.body = replyList
}

exports.addArticleReply = function *() {
  
}