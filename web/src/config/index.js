'use strict'

if (process.env.NODE_ENV === ('production')) {
  module.exports = require('./config.api.prod.js')
} else {
  module.exports = require('./config.api.dev.js')
}