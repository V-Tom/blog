'use strict'
const { mongo: { ObjectId } } = require('mongoose')
const moment = require('moment')

const { blogCoon } = require('../config/mongo/mongoConfig')
const blogArticleDetailModel = blogCoon.model('blogArticleDetail')
const blogArticleAddonModel = blogCoon.model('blogArticleAddon')
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
    detail = await blogArticleDetailModel
      .findOne({ articleId })
      .lean()
      .exec()
    if (detail) {
      await REDIS.setCache(key, detail)
    } else {
      detail = null
    }
  }

  /**
   * update article detail views
   */
  let views = 0
  if (detail) {
    const addon = await blogArticleAddonModel.findOneAndUpdate({ articleId }, {
      $inc: {
        views: 1
      }
    }, { upsert: true, new: true, setDefaultsOnInsert: true })
    views = addon ? addon.views : 0
  }

  ctx.body = { data: detail, views }

  return next()
}

/**
 * updateArticleDetail
 * @param ctx
 * @param next
 * @returns {Promise.<*>}
 */
exports.updateArticleDetail = async (ctx, next) => {
  let body = ctx.request.body
  let articleId = ctx.params.articleId

  await blogArticleDetailModel.update({
    articleId
  }, {
    '$set': {
      title: body.title,
      author: body.author,
      meta: body.meta,
      subTitle: body.subTitle,
      preview: body.intro && body.intro.preview || '',
      intro: {
        preview: body.intro && body.intro.preview || '',
        pic: body.intro && body.intro.pic || ''
      },
      tags: body.tags,
      githubArticleUrl: body.githubArticleUrl || '',
      content: body.content
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
  const { body } = ctx.request
  const articleId = generateArticleId(23)
  const date = new Date()

  const newArticle = new blogArticleDetailModel({
    title: body.title,
    articleId,
    author: body.author,
    meta: body.meta,
    subTitle: body.subTitle,
    introPreview: body.introPreview,
    introWrapper: body.introWrapper,
    postTime: {
      localTime: moment(date).format('YYYY-MM-DD HH:mm:ss'),
      UTCTime: date.getTime()
    },
    tags: body.tags,
    gitArticleUrl: body.gitArticleUrl || 'https://github.com/V-Tom',
    content: body.content
  })

  const newArticleAddon = new blogArticleAddonModel({
    articleId
  })

  await newArticle.save()
  await newArticleAddon.save()
  await REDIS.sendCommand('keys', ['BLOG_LIST_REDIS_PREFIX:articleList*']).then(cache => cache.forEach(item => REDIS.removeCache(item)))

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
    await blogArticleDetailModel.remove({
      articleId,
      _id
    })

    await blogArticleAddonModel.remove({
      articleId
    })

    await REDIS.removeCache(`${redisPrefix}:${articleId}`)

  } else {
    ctx.throw(400, `API delete article need articleId and ObjectId`)
  }

  ctx.body = {}

  next()
}