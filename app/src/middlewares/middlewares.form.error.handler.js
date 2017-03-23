'use strict'

module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch ( err ) {
      ctx.body = {
        status: 500,
        result: {
          msg: 'server error'
        }
      }
    }
  }
}
