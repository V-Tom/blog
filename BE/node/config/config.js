//base site CONFIG
"use strict";

const realDb = require('./db');
const path = require('path');
const db = {
    dbBlog: realDb.blog,
    dbUser: realDb.users
};
const app = {
    port: 4000,
    domain: "t-tom.me",
    env: 'development',
    maxAge: 36500,
    routerTitle: {
        index: "一个全栈开发者的博客",
        notFound: "404 page",
        error: "500 page"
    }
};
const apiVersion = 'v1';
const session = realDb.session;
const cdn = {
    "bucket": {
        "node": {
            "domain": "",
            "isPrivate": false,
            "name": "node"
        }
    },
    "ACCESS_KEY": "",
    "SECRET_KEY": ""
};
const filePath = {
    gitArticleMDPath: path.join(__dirname, '../../blogArticle'),
    modsPath: path.join(__dirname, '../mods')
};

const dbSource = realDb.dbSource;

const userAccess = "";
const redisExp = 1000 * 3600 * 7;

module.exports = {
    app,
    apiVersion,
    session,
    cdn,
    filePath,
    db,
    dbSource,
    userAccess,
    redisExp
};