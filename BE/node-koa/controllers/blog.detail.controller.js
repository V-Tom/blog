'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const articleDetail = blogCoon.model('articleDetail')
const redisPrefix = "BLOG_DETAIL_REDIS_PREFIX"

const redis = require('../middlewares/redis.middleware')

exports.getArticleDetail = function *() {
    const id = this.query.articleId
    const key = `${redisPrefix}:${id}`

    let detail = yield redis.get(key)
    if (!detail) {
        detail = yield articleDetail.findOne({"articleId": id}).exec()
        if (detail) {
            detail = yield redis.set(key, JSON.stringify(detail._doc))
            detail["poweredBy"] = "REDIS"
            this.body = detail
        }
    }
    this.body = detail
}