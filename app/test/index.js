'use strict'
const supertest = require('supertest')
const agent = supertest('http://localhost:4000/api/v1')
const assert = require('chai').assert

const mongo = require('./platform.mongodb')
const cache = require('./platform.redis')

before(done => {
  mongo.connect(done)
})

before(done=> {
  mongo.seed(done)
})

before(done=> {
  cache.connect(done)
})

require('./test.user.auth')(agent, assert)
require('./test.blog.reply')(agent, assert)
require('./test.blog.list.detail')(agent, assert)


after(done=> {
  mongo.drop(done)
})

after(done => {
  mongo.close(done)
})

after(done=> {
  cache.clear(done)
})
