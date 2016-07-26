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
  replyUserId: Schema.Types.ObjectId,
  userType: {type: String, default: "github"},
  content: String
});

/**
 * Model
 */
module.exports = blogCoon.model('commitList', commitListSchema, 'articleReply')