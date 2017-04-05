'use strict';
const path = require('path')
const fs = require('fs')

/**
 * api config
 * @type {string}
 */
const apiVersion = "v1"
const apiPrefix = 'api'

/**
 * db port config
 * @type {string}
 */
const dbPort = process.env.NODE_ENV === 'test' ? '127.0.0.1:27018' : '127.0.0.1:27017'

/**
 *  local config file
 */
const localConfigPath = path.join(__dirname, './local.conf.json')
let localConfig = {
  app: {}
}
if (fs.existsSync(localConfigPath)) {
  localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8').replace(/\r?\n|\r/g, " "))
}

/**
 * export
 * @type {{app: *}}
 */
module.exports = {
  app: Object.assign({}, {
    port: 4000,
    root: path.join(__dirname, '../'),
    env: 'development',
    secret: {
      admin: 'admin'
    },
    db: {
      dbPort,
      users: { uri: `mongodb://${dbPort}/user` },
      blog: { uri: `mongodb://${dbPort}/blog` },
      cache: { uri: `mongodb://${dbPort}/cache` }
    },
    userAccess: {
      github: {
        client_id: "",
        client_secret: ""
      }
    },
    qiniu: {
      ACCESS_KEY: "",
      SECRET_KEY: "",
      signedUrlExpires: 24 * 60 * 60,
      bucket: ''
    },
    redis: {
      redisExpDev: 3000,
      redisExp: 60 * 1000 * 60 * 24,
      config: {
        host: '0.0.0.0',
        password: ""
      }
    },
    cookies: {
      expires: 60 * 1000 * 60 * 24
    },
    token: {
      secret: 'NOMAND_KOA_BLOG_SERVRFARMWORK',
      expires: 60 * 1000 * 60 * 24
    },
    restfulAPI: {
      apiVersion, apiPrefix,
      apiRegExp: new RegExp('^\/' + apiPrefix + '/' + apiVersion)
    }
  }, localConfig.app)
}
