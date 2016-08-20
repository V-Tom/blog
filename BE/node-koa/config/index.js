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
    qiniu: {
      ACCESS_KEY: 'A1vNdjThH47GlwQSD51VdC4PDWF_mIq-VYD9kXi0',
      SECRET_KEY: 'SORzSSCAcMvduBGKCnQUtpb4wQ35awYtU68bi80L',
      signedUrlExpires: '24 * 60 * 60',
      bucket: 'node'
    },
    redis: {
      redisExpDev: 5,
      redisExp: 60 * 60 * 24
    },
    tokenSecret: "NOMAND_KOA_BLOG_SERVRFARMWORK",
    tokenExpireTime: 60 * 60 * 24,
    restfulAPI: {
      apiVersion, apiPrefix,
      apiRegExp: new RegExp('^\/' + apiPrefix + '/' + apiVersion)
    },
    env: "development"
  }
}