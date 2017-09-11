'use strict'

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const co = require('co')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const blogCoon = mongoose.createConnection('mongodb://localhost:27018/blog')

const blogDetailSchema = blogCoon.model('blogArticleDetail', new Schema({}), 'articleDetail')
const blogUserSchema = blogCoon.model('blogArticleUsers', new Schema({
  detail: { type: Object, default: {} }
}, { versionKey: false }), 'blogUsers')


/**
 * 链接 mongo
 * @param done
 */
exports.connect = (done) => {
  function connMongodbAsync(conn) {
    return new Promise((resolve, reject) => {
      conn.on('connected', resolve)
      conn.on('error', err => {
        reject(err)
      })
    })
  }

  co(function*() {
    try {
      yield [
        connMongodbAsync(blogCoon)
      ]
      done()
    } catch ( e ) {
      done(e)
    }
  })
}

/**
 * user seed
 * @param done
 */
exports.seed = (done) => {

  let seedBlogReplyUser = {
    _id: '594743785051cd159ab261b4',
    detail: {
      email: 'iamnomand@gmail.com'
    }
  }

  co(function*() {
    try {
      yield [
        (new blogUserSchema(seedBlogReplyUser)).save(function (err, user) {
          global.blogSeedUserId = user.id
        })
      ]
      done()
    } catch ( e ) {
      done(e)
    }
  })
}
/**
 * 删除测试 mongo 数据
 * @param done
 */
exports.drop = done => {
  co(function*() {
    try {
      yield [
        // blogReplySchema.remove({}).exec(),
        blogUserSchema.remove({}).exec(),
        blogDetailSchema.remove({}).exec()
      ]
      done()
    } catch ( e ) {
      done(e)
    }
  })
}
/**
 * 关闭 mongo
 * @param done
 */

exports.close = done => {
  function closeMongo(conn) {
    return new Promise((resolve, reject) => {
      conn.close(resolve)
    })
  }

  co(function*() {
    try {
      yield [
        closeMongo(blogCoon)
      ]
      done()
    } catch ( e ) {
      done(e)
    }
  })
}