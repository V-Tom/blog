'use strict';
const path = require('path')
const fs = require('fs')

/**
 * api config
 */
const apiVersion = "v1"
const apiPrefix = 'api'

/**
 * db port config
 */
const ENV = process.env.NODE_ENV
const isProduction = ENV === 'production'
const isDevelopment = ENV === 'development'
const isUnitTest = ENV === 'unitTest'
const dbPort = isUnitTest ? '127.0.0.1:27018' : '127.0.0.1:27017'


const chalkColor = isProduction ? 'yellow' : (isUnitTest ? 'inverse' : (isDevelopment ? 'cyan' : null))
if (!chalkColor) {
  throw new Error(`process.env.NODE_ENV : ${ENV} is not configure`)
}

/**
 *  local config file
 */
let localConfig = {
  app: {}
}
if (isProduction) {
  const localConfigPath = path.join(__dirname, '../local.conf.json')
  if (fs.existsSync(localConfigPath)) {
    localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8').replace(/\r?\n|\r/g, " "))
  }
}

console.log(CHALK[chalkColor](`------------------------------------------------------------------`))
console.log(CHALK[chalkColor](`The server is running on ${ENV} environment`))
console.log(CHALK[chalkColor](`------------------------------------------------------------------`))


/**
 * export
 * @type {{app: *}}
 */
module.exports = {
  app: Object.assign({}, {
    port: 4000,
    root: path.join(__dirname, '../'),
    env: ENV,
    db: {
      dbPort,
      users: { uri: `mongodb://${dbPort}/user` },
      blog: { uri: `mongodb://${dbPort}/blog` },
      cache: { uri: `mongodb://${dbPort}/cache` }
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
    token: {
      secret: "",
      userId: "",
      email: "",
      expires: 3600
    },
    gcm: {
      key: ""
    },
    restfulAPI: {
      apiVersion, apiPrefix,
      apiRegExp: new RegExp('^\/' + apiPrefix + '/' + apiVersion)
    }
  }, isProduction ? localConfig.app : {})
}
