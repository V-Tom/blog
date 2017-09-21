'use strict';
const { Schema } = require('mongoose')
const { blogCoon } = require('../config/mongo/mongoConfig')

/**
 * Schema
 */
const blogArticleAddonSchema = new Schema({
    articleId: String,
    views: { type: Number, default: 0 }
  },
  { versionKey: false }
);


blogArticleAddonSchema.set('toObject', { getters: true, virtuals: true })

/**
 * Model
 */
module.exports = blogCoon.model('blogArticleAddon', blogArticleAddonSchema, 'articleAddon')