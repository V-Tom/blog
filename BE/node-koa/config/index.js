'use strict';
const path = require('path')
const dbPort = '139.196.194.79:27017'
const apiVersion = "v1"
const apiPrefix = 'api'

module.exports = {
  app: {
    port: 4000,
    root: path.join(__dirname, '../'),
    db: {
      port: dbPort,
      users: { uri: 'mongodb://admin:zhangchi123ZC@' + dbPort + '/user' },
      blog: { uri: 'mongodb://admin:zhangchi123ZC@' + dbPort + '/blog' },
      cache: { uri: 'mongodb://admin:zhangchi123ZC@' + dbPort + '/cache' }
    },
    userAccess: {
      github: {
        client_id: "2c5d30e472a317b5c328",
        client_secret: "b3e496c7102058763e328bbd4f7ea0e0aa5df4cd"
      }
    },
    redis: {
      redisExpDev: 5,
      redisExp: 60 * 60 * 24
    },
    tokenSecret: "NOMAND_KOA_BLOG_SERVRFARMWORK",
    tokenExpireTime: 60 * 60 * 24,
    restfulAPI: {
      apiVersion, apiPrefix,
      apiRegExp: new RegExp('^\/' + apiPrefix + '/' + apiVersion),
      RESPONSE_ERROR: {
        "success": false,
        "data": null,
        "error": undefined
      },
      RESPONSE_SUCCESS: {
        "success": true,
        "data": undefined
      },
      RESPONSE_TOKEN_EXPIRED: {
        "success": false,
        "data": null,
        "error": "Token Expired"
      }
    },
    env: "development"
  }
}