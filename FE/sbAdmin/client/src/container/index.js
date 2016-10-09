'use strict'
if (process.env.NODE_ENV === 'development') {
  module.exports = require('./App.dev.js')
} else {
  module.exports = require('./App.prod.js')
}