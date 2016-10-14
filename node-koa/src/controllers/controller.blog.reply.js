'use strict'
const { blogCoon }=require('../config/mongoConfig')
const { mongo:{ ObjectId } }=require('mongoose')

const blogArticleReplyModel = blogCoon.model('blogArticleReply')
const redisPrefix = "BLOG_COMMIT_REDIS_PREFIX"


exports.getArticleReply = function *() {
  let { articleId, limit, page } = this.query

  limit = Number(limit)
  page = Number(page)
  if (!articleId) {
    this.throw('You need provide `articleId` on this API URL query ', 400)
  }
  if (!isNaN(limit) && !isNaN(page)) {
    const key = `${redisPrefix}:${articleId}`

    let replyList = yield redis.getCache(key)
    if (replyList) {
      this.APICached = true
    } else {
      const populateSelect = ['avatar_url', 'name', 'email', 'html_url'].map(item=>`userDetail.${item}`).join(' ')
      let query = { "articleId": articleId }
      let count = yield blogArticleReplyModel.count(query)
      let list = yield blogArticleReplyModel.find(query)
        .skip(limit * (page - 1)).limit(limit)
        .populate('user', populateSelect)
        .lean().exec()

      if (list) {
        replyList = { count, data: list, limit, page }
        yield redis.setCache(key, replyList)
      } else {
        replyList = null
      }
    }
    this.body = replyList
  } else {
    this.throw(`API router query limit:${this.query.limit} or page:${this.query.page} must both provide as Number`, 400)
  }
}

exports.addArticleReply = function *() {
  let { _id } = this._user
  let { articleId, content, replyTo } = this.request.body
  let newReply = new blogArticleReplyModel({
    articleId, content, replyTo, user: _id
  })
  yield newReply.save()
  yield redis.removeCache(`${redisPrefix}:${articleId}`)
}

exports.deleteReply = function *() {
  let { replyId, articleId }=this.query
  yield blogArticleReplyModel.findOneAndRemove({ "_id": new ObjectId(replyId) })
  yield redis.removeCache(`${redisPrefix}:${articleId}`)
}