'use strict';
const DB = "139.196.194.79:27017";
const db = {
  "users": {
    "port": "mongodb://admin:zhangchi123ZC@" + DB + "/user",
    "collection": {
      "user": "user"
    }
  },
  "cache": {
    "port": "mongodb://admin:zhangchi123ZC@" + DB + "/cache",
    "collection": {
      "session": "sessions"
    }
  },
  "blog": {
    "port": "mongodb://admin:zhangchi123ZC@" + DB + "/blog",
    "collection": {
      "blogList": "blogList",
      "articleReplyList": "articleReplyList",
      "articleReplyUserInfo": "articleReplyUserInfo",
      "articleDetail": "articleDetail"
    }
  }
};
const blogDetailDbSource = {
  source: {
    "DBName": db.blog.port,
    "DBCollection": db.blog.collection.articleDetail
  }
};
const blogListDbSource = {
  source: {
    "DBName": db.blog.port,
    "DBCollection": db.blog.collection.blogList
  }
};
const replyDbSource = {
  source: {
    "DBName": db.blog.port,
    "DBCollection": db.blog.collection.articleReplyList
  }
};
const replyUserInfoDbSource = {
  source: {
    "DBName": db.blog.port,
    "DBCollection": db.blog.collection.articleReplyUserInfo
  }
};

const userDbSource = {
  source: {
    "DBName": db.users.port,
    "DBCollection": db.users.collection.user
  }
};
const sessionMaxAge = 36000;
const session = function (store) {
  return {
    "secret": "Nomand",
    "resave": false,
    "saveUninitialized": true,
    "cookie": {
      "maxAge": sessionMaxAge
    },
    "store": new store({
      "url": 'mongodb://admin:zhangchi123ZC@' + DB + '/cache'
    })
  }
};

module.exports = {
  session: session,
  db: db,
  sessionMaxAge: sessionMaxAge,
  dbSource: {
    blogDetail: blogDetailDbSource,
    blogList: blogListDbSource,
    reply: replyDbSource,
    replyUser: replyUserInfoDbSource,
    user: userDbSource
  }
};
