'use strict'
const { blogCoon } = require('../config/mongo/mongoConfig')
const { mongo: { ObjectId } } = require('mongoose')
const moment = require('moment')
const blogArticleDetaiModel = blogCoon.model('blogArticleDetail')
const { generateArticleId } = require('../lib')
const redisPrefix = "BLOG_DETAIL_REDIS_PREFIX"

/**
 * getArticleDetail
 * @param ctx
 * @param next
 * @returns {Promise.<*>}
 */
exports.getArticleDetail = async (ctx, next) => {
  let articleId

  if (ctx.params.articleId) {
    articleId = ctx.params.articleId
  } else if (ctx.query.articleId) {
    articleId = ctx.query.articleId
  } else {
    ctx.throw(401, 'unknown articleId')
  }

  const key = `${redisPrefix}:${articleId}`

  let detail = await REDIS.getCache(key)
  if (detail) {
    ctx.state.APICached = true
  } else {
    detail = await blogArticleDetaiModel.findOne({ articleId }).lean().exec()
    if (detail) {
      await REDIS.setCache(key, detail)
    } else {
      detail = null
    }
  }
  ctx.body = { data: detail }
  return next()
}

/**
 * updateArticleDetail
 * @param ctx
 * @param next
 * @returns {Promise.<*>}
 */
exports.updateArticleDetail = async (ctx, next) => {
  let reqBody = ctx.request.body
  let articleId = ctx.params.articleId

  await blogArticleDetaiModel.update({
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
  })
  await REDIS.removeCache(`${redisPrefix}:${articleId}`)
  ctx.body = {}
  return next()
}

/**
 * createArticle
 * @param ctx
 * @param next
 * @returns {Promise.<*>}
 */
exports.createArticle = async (ctx, next) => {
  let reqBody = ctx.request.body
  let articleId = generateArticleId(23)
  let date = new Date()

  let newArticle = new blogArticleDetaiModel({
    title: reqBody.title,
    articleId,
    author: reqBody.author,
    meta: reqBody.meta,
    subTitle: reqBody.subTitle,
    introPreview: reqBody.introPreview,
    introWrapper: reqBody.introWrapper,
    postTime: {
      localTime: moment(date).format('YYYY-MM-DD HH:mm:ss'),
      UTCTime: date.getTime()
    },
    tags: reqBody.tags,
    gitArticleUrl: reqBody.gitArticleUrl || 'https://github.com/V-Tom',
    content: reqBody.content
  })

  await REDIS.sendCommand('keys', ['BLOG_LIST_REDIS_PREFIX:articleList*']).then(cache => {
    cache.forEach(item => REDIS.removeCache(item))
  })
  await newArticle.save()

  ctx.body = {}

  return next()
}

/**
 * deleteArticle
 * @param ctx
 * @param next
 * @returns {Promise.<*>}
 */
exports.deleteArticle = async (ctx, next) => {
  let { _id, articleId } = ctx.params
  if (articleId) {
    await blogArticleDetaiModel.remove({
      articleId,
      _id
    })
    await REDIS.removeCache(`${redisPrefix}:${articleId}`)
  }
  ctx.body = {}
  return next()
}