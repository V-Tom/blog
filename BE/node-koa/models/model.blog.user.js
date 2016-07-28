'use strict';
const {Schema} = require('mongoose')
const {blogCoon} = require('../mongoConfig')

/**
 * Schema
 */

const commitListSchema = new Schema({
  userType: {type: String, default: "github"},
  userDetail: {type: Object, default: {}}
}, {versionKey: false});

/**
 * Model
 */
module.exports = blogCoon.model('blogUsers', commitListSchema, 'blogUsers')