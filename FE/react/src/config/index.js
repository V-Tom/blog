'use strict'
if (process.env.NODE_ENV === 'development') {
  module.exports = require('!json!../server.json')
} else {
  const API_ROOT = 'https://t-tom.me/api/'
  const API_VERSION = 'v1'
  const DO_NOT_INTERCEPTOR_PORT = ['http://up.qiniu.com/']
  module.exports = Object.assign({}, {
    restfulAPI: {
      API_ROOT,
      API_VERSION,
      DO_NOT_INTERCEPTOR_PORT
    }
  })
}