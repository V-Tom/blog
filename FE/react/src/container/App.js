'use strict'
'use strict'
if (process.env.NODE_ENV === 'development') {
  module.exports = require('./App.dev')
} else {
  module.exports = require('./App.prod')
}