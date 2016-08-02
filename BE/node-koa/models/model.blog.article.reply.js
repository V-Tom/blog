'use strict';
const { Schema } = require('mongoose')
const { blogCoon } = require('../mongoConfig')

/**
 * Schema
 */

const blogArticleReplySchema = new Schema({
  articleId: String,
  articleDbId: Schema.Types.ObjectId,
  replyTo: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  content: String
}, { versionKey: false });

blogArticleReplySchema.set('toObject', { getters: true, virtuals: true })

/**
 * Model
 */
module.exports = blogCoon.model('blogArticleReply', blogArticleReplySchema, 'articleReplyList')