'use strict';
const {Schema} = require('mongoose')
const {blogCoon} = require('../mongoConfig')

/**
 * Schema
 */

const commitUserSchema = new Schema({
    userType: {type: String, default: "github"},
    detail: Object
});


/**
 * Model
 */
module.exports = blogCoon.model('commitUser', commitUserSchema, 'articleReplyUserInfo')