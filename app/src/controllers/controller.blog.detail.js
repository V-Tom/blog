'use strict'
const { blogCoon }=require('../config/mongoConfig')
const { mongo:{ ObjectId } }=require('mongoose')
const moment = require('moment')
const blogArticleDetaiModel = blogCoon.model('blogArticleDetail')
const redisPrefix = "BLOG_DETAIL_REDIS_PREFIX"
const { generateArticleId } = require('../lib')

exports.getArticleDetail = function *() {
  const { articleId } = this.query
  const key = `${redisPrefix}:${articleId}`

  let detail = yield redis.getCache(key)
  if (detail) {
    this.APICached = true
  } else {
    detail = yield blogArticleDetaiModel.findOne({ "articleId": articleId }).lean().exec()
    if (detail) {
      yield redis.setCache(key, detail)
    } else {
      detail = null
    }
  }
  this.body = { data: detail }
}

exports.updateArticleDetail = function *() {
  let reqBody = this.request.body
  let articleId = this.params.articleId

  yield [blogArticleDetaiModel.update({
    articleId
  }, {
    '$set': {
      title: reqBody.title,
      author: reqBody.author,
      meta: reqBody.meta,
      subTitle: reqBody.subTitle,
      preview: reqBody.intro && reqBody.intro.preview || '',
      intro: {
        preview: reqBody.intro && reqBody.intro.preview || '',
        pic: reqBody.intro && reqBody.intro.pic || ''
      },
      tags: reqBody.tags,
      githubArticleUrl: reqBody.githubArticleUrl || '',
      content: reqBody.content
    }
  }),
    redis.removeCache(`${redisPrefix}:${articleId}`)
  ]

}
exports.createArticle = function *() {
  let reqBody = this.request.body
  let articleId = generateArticleId(23)
  let date = new Date()

  let newArticle = new blogArticleDetaiModel({
    title: reqBody.title,
    articleId,
    author: reqBody.author,
    meta: reqBody.meta,
    subTitle: reqBody.subTitle,
    intro: {
      preview: reqBody.intro && reqBody.intro.preview || '',
      pic: reqBody.intro && reqBody.intro.pic || ''
    },
    postTime: { localTime: moment(date).format('YYYY-MM-DD HH:mm:ss'), UTCTime: date.getTime() },
    tags: reqBody.tags,
    githubArticleUrl: reqBody.githubArticleUrl || 'https://github.com/V-Tom',
    content: reqBody.content
  })

  redis.sendCommand('keys', ['BLOG_LIST_REDIS_PREFIX:articleList*']).then(cache=> {
    cache.forEach(item=>redis.removeCache(item))
  })
  yield newArticle.save()
}

exports.deleteArticle = function *() {
  let { _id, articleId } = this.params
  if (articleId) {
    yield [blogArticleDetaiModel.remove({
      articleId,
      _id
    }),
      redis.removeCache(`${redisPrefix}:${articleId}`)
    ]
  }
}