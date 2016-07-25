'use strict'
const {blogCoon}=require('../mongoConfig')
const {mongo:{ObjectId}}=require('mongoose')

const articleDetail = blogCoon.model('articleDetail')

exports.getArticleDetail = function *() {
  const id = this.query.articleId
  const detail = yield articleDetail.findOne({"articleId": id}).exec()
  if (detail) {
    this.body = detail
    console.log(detail)
  } else {

  }
}