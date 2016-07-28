'use strict';
const {Schema} = require('mongoose')
const {blogCoon} = require('../mongoConfig')

/**
 * Schema
 */

const blogDetailSchema = new Schema({
  title: String,
  articleId: String,
  author: String,
  meta: String,
  subTitle: String,
  intro: {
    preview: String,
    pic: String
  },
  postTime: {localTime: Date, UTCTime: Date},
  tag: {type: Array, default: []},
  githubArticleUrl: String,
  content: String,
  views: {type: Number, default: 0}
}, {versionKey: false});


blogDetailSchema.set('toObject', {getters: true, virtuals: true})

/**
 * Model
 */
module.exports = blogCoon.model('articleDetail', blogDetailSchema, 'articleDetail')