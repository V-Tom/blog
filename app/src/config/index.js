'use strict';
const path = require('path')
const dbPort = '139.196.194.79:27017'
const apiVersion = "v1"
const apiPrefix = 'api'
const mochaTestDB = process.env.NODE_ENV === 'test'

module.exports = {
  app: {
    port: 4000,
    root: path.join(__dirname, '../'),
    env: 'development',
    db: {
      port: dbPort,
      users: { uri: mochaTestDB ? 'mongodb://localhost:27018/users' : 'mongodb://admin:zhangchi123ZCNOMAND@' + dbPort + '/user' },
      blog: { uri: mochaTestDB ? 'mongodb://localhost:27018/blog' : 'mongodb://admin:zhangchi123ZCNOMAND@' + dbPort + '/blog' },
      cache: { uri: mochaTestDB ? 'mongodb://localhost:27018/cache' : 'mongodb://admin:zhangchi123ZCNOMAND@' + dbPort + '/cache' }
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
      redisExp: 60 * 1000 * 60 * 24
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
  }
}
