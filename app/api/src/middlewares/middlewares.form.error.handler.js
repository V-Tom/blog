'use strict'

module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch ( err ) {
      if (err.name && err.status) {
        /**
         * http error
         */
        ctx.body = {
          status: err.status,
          result: {
            err: err.message,
            errName: err.name
          }
        }
      } else {
        /**
         * native error
         */
        ctx.body = {
          status: 500,
          result: {
            err: 'SERVER ERROR ! Please concat the server develop'
          }
        }
      }
    }
  }
}
