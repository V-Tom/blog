'use strict';
const { Schema } = require('mongoose')
const { blogCoon } = require('../config/mongo/mongoConfig')

/**
 * Schema
 */
const blogArticleDetailSchema = new Schema({
    title: String,
    articleId: String,
    author: String,
    meta: String,
    subTitle: String,
    introPreview: String,
    introWrapper: String,
    content: String,
    postTime: {
      localTime: String,
      UTCTime: Number
    },
    tags: { type: Array, default: [] },
    gitArticleUrl: { type: String, default: 'https://github.com/V-Tom' },
    views: { type: Number, default: 0 }
  },
  { versionKey: false }
);


blogArticleDetailSchema.set('toObject', { getters: true, virtuals: true })

/**
 * Model
 */
module.exports = blogCoon.model('blogArticleDetail', blogArticleDetailSchema, 'articleDetail')