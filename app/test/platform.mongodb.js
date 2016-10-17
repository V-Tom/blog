'use strict'

const mongoose = require('mongoose')
const co = require('co')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const blogCoon = mongoose.createConnection('mongodb://localhost:27018/blog')

//set schema
let blogReplySchema = blogCoon.model('blogArticleReply', new Schema({}), 'articleReplyList')
let blogDetailSchema = blogCoon.model('blogArticleDetail', new Schema({}), 'articleDetail')
let blogUserSchema = blogCoon.model('blogArticleUsers', new Schema({
  userType: { type: String, default: "Github" },
  userDetail: { type: Object, default: {} }
}, { versionKey: false }), 'blogUsers')


/**
 * 链接 mongo
 * @param done
 */
exports.connect = (done)=> {
  function connMongodbAsync(conn) {
    return new Promise((resolve, reject) => {
      conn.on('connected', resolve)
      conn.on('error', err=> {
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
exports.seed = (done)=> {
  let seedBlogReplyUser = {
    "userDetail": {
      "updated_at": "2016-08-12T08:32:29Z",
      "created_at": "2014-07-01T05:27:33Z",
      "following": 11,
      "followers": 20,
      "public_gists": 0,
      "public_repos": 29,
      "bio": "Node && FE Developer",
      "hireable": null,
      "email": "iamnomand@gmail.com",
      "location": null,
      "blog": "https://t-tom.me",
      "company": null,
      "name": "zhang",
      "site_admin": false,
      "type": "User",
      "received_events_url": "https://api.github.com/users/V-Tom/received_events",
      "events_url": "https://api.github.com/users/V-Tom/events{/privacy}",
      "repos_url": "https://api.github.com/users/V-Tom/repos",
      "organizations_url": "https://api.github.com/users/V-Tom/orgs",
      "subscriptions_url": "https://api.github.com/users/V-Tom/subscriptions",
      "starred_url": "https://api.github.com/users/V-Tom/starred{/owner}{/repo}",
      "gists_url": "https://api.github.com/users/V-Tom/gists{/gist_id}",
      "following_url": "https://api.github.com/users/V-Tom/following{/other_user}",
      "followers_url": "https://api.github.com/users/V-Tom/followers",
      "html_url": "https://github.com/V-Tom",
      "url": "https://api.github.com/users/V-Tom",
      "gravatar_id": "",
      "avatar_url": "https://avatars.githubusercontent.com/u/8033489?v=3",
      "id": 8033489,
      "login": "V-Tom"
    },
    "userType": "GitHub"
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
        blogReplySchema.remove({}).exec(),
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