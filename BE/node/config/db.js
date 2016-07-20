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
    port: {blog: db.blog.port, users: db.users.port, cache: db.cache.port},
    sessionMaxAge: sessionMaxAge,
    collection: {
        blogDetail: db.blog.collection.articleDetail,
        blogList: db.blog.collection.blogList,
        reply: db.blog.collection.articleReplyList,
        replyUser: db.blog.collection.articleReplyUserInfo,
        user: db.users.collection.user
    }
};
