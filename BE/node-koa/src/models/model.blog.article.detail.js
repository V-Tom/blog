'use strict';
const { Schema } = require('mongoose')
const { blogCoon } = require('../config/mongoConfig')

/**
 * Schema
 */

const blogArticleDetailSchema = new Schema({
  title: String,
  articleId: String,
  author: String,
  meta: String,
  subTitle: String,
  intro: {
    preview: String,
    pic: String
  },
  postTime: { localTime: Date, UTCTime: Date },
  tags: { type: Array, default: [] },
  githubArticleUrl: { type: String, default: 'https://github.com/V-Tom' },
  content: String,
  views: { type: Number, default: 0 }
}, { versionKey: false });


blogArticleDetailSchema.set('toObject', { getters: true, virtuals: true })

/**
 * Model
 */
module.exports = blogCoon.model('blogArticleDetail', blogArticleDetailSchema, 'articleDetail')