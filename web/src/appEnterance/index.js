'use strict'
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./app.prod.js')
} else {
  module.exports = require('./app.dev.js')
}