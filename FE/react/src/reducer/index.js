'use strict';
if (process.env.NODE_ENV === 'development') {
  module.exports = require('./reducer.config.development')
} else {
  module.exports = require('./reducer.config.production')
}