'use strict'
const { blogCoon }=require('../mongoConfig')
const { mongo:{ ObjectId } }=require('mongoose')

const blogArticleReplyCoon = blogCoon.model('blogArticleReply')
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

    let replyList = yield redis.get(key)
    if (replyList) {
      this.APICached = true
      replyList = JSON.parse(replyList)
    } else {
      const populateSelect = ['avatar_url', 'name', 'email', 'html_url'].map(item=>`userDetail.${item}`).join(' ')
      replyList = yield blogArticleReplyCoon.find({ "articleId": articleId })
        .skip(limit * (page - 1)).limit(limit)
        .populate('user', populateSelect)
        .lean().exec()
      if (replyList) {
        yield redis.set(key, replyList)
      } else {
        replyList = null
      }
    }
    this.body = { data: replyList, count: 100 }
  } else {
    this.throw(`API router query limit:${this.query.limit} or page:${this.query.page} must both provide as Number`, 400)
  }
}

exports.addArticleReply = function *() {
  let { _id } = this._user
  let { articleId, content, replyTo } = this.request.body
  let newReply = new blogArticleReplyCoon({
    articleId, content, replyTo, user: _id
  })
  yield newReply.save()
  yield redis.del(`${redisPrefix}:${articleId}`)
}

exports.deleteReply = function *() {
  let { replyId, articleId }=this.query
  yield blogArticleReplyCoon.findOneAndRemove({ "_id": new ObjectId(replyId) })
  yield redis.del(`${redisPrefix}:${articleId}`)
}