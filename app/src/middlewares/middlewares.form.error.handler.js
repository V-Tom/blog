'use strict'
module.exports = function () {
  return function *(next) {
    try {
      yield *next;
    } catch ( err ) {
      if (CONFIG.app.restfulAPI.apiRegExp.test(this.url)) {
        this.body = {
          status: err.status || this.status,
          msg: err.message
        }
      } else {
        this.body = {
          status: 500,
          msg: 'server error'
        }
      }
    }
  }
}
