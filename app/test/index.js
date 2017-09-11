'use strict'
const agent = require('supertest')('http://127.0.0.1:4000/api/v1')
const assert = require('chai').assert
const mocha = require('mocha')
const mongo = require('./platform.mongodb')
const cache = require('./platform.redis')

before(done => {
  mongo.connect(done)
})

before(done => {
  mongo.drop(done)
})

before(done => {
  mongo.seed(done)
})

before(done => {
  cache.connect(done)
})

before(done => {
  cache.clear(done)
})

require('./test.user.auth')(agent, assert)
require('./test.blog.list.detail')(agent, assert)
// require('./test.blog.reply')(agent, assert)


after(done => {
  mongo.drop(done)
})

after(done => {
  mongo.close(done)
})

after(done => {
  cache.clear(done)
})
