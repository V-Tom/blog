'use strict'

module.exports = function () {
  return function *(next) {
    try {
      yield next;
    } catch (err) {
      if (global.config.app.restfulAPI.apiRegExp.test(this.url)) {
        if (err && err.name !== 'ValidationError') {
          this.throw(err)
        }
        this.status = 400
        this.body = {
          formErrors: _.mapValues(err.errors, 'message')
        }
      }
    }
  }
}
