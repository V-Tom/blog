'use strict'
if (process.env.NODE_ENV === 'development') {
  module.exports = require('./App.development.js')
} else {
  module.exports = require('./App.production.js')
}