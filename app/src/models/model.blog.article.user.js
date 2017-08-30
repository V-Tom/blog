'use strict';
const { Schema } = require('mongoose')
const { blogCoon } = require('../config/mongo/mongoConfig')

/**
 * Schema
 */

const blogArticleUsersSchema = new Schema({
  detail: { type: Object, default: {} }
}, { versionKey: false });


blogArticleUsersSchema.set('toObject', { getters: true, virtuals: true })

/**
 * Model
 */
module.exports = blogCoon.model('blogArticleUsers', blogArticleUsersSchema, 'blogUsers')