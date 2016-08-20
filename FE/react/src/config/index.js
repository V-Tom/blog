'use strict'
if (process.env.NODE_ENV === 'production') {
  const API_ROOT = ''
  const API_VERSION = 'v1'
  const DO_NOT_INTERCEPTOR_PORT = ['http://up.qiniu.com/']
  module.exports = Object.assign({}, {
    'TOKEN': '',
    API_ROOT,
    API_VERSION
  })

} else {
  module.exports = require('!json!../server.json')
}