//base site CONFIG
"use strict";

const db = require('./db');
const path = require('path');
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
const session = db.session;
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


const userAccess = "";
const redisExpDev = 3;
const redisExp = 60 * 60 * 24 * 7;

module.exports = {
    app,
    apiVersion,
    session,
    cdn,
    path: filePath,
    db,
    userAccess,
    redis: {
        redisExp, redisExpDev
    }
};