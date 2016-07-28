'use strict';
const {Schema} = require('mongoose')
const {blogCoon} = require('../mongoConfig')

/**
 * Schema
 */

const commitListSchema = new Schema({
  articleId: String,
  articleDbId: Schema.Types.ObjectId,
  replyTo: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  content: String
}, {versionKey: false});

/**
 * Model
 */
module.exports = blogCoon.model('commitList', commitListSchema, 'articleReplyList')