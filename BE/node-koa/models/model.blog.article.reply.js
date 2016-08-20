'use strict';
const { Schema } = require('mongoose')
const { blogCoon } = require('../mongoConfig')

/**
 * Schema
 */

const blogArticleReplySchema = new Schema({
  articleId: String,
  articleDbId: Schema.Types.ObjectId,
  replyTo: {
    type: Schema.Types.Mixed,
    validate: [function (v) {
      return v === null || typeof  v === 'string'
    }, ' validate blog article reply schema `replyTo` failed']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'blogArticleUsers'
  },
  content: String
}, { versionKey: false });

blogArticleReplySchema.set('toObject', { getters: true, virtuals: true })

/**
 * Model
 */
module.exports = blogCoon.model('blogArticleReply', blogArticleReplySchema, 'articleReplyList')