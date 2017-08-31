module.exports = function () {
  return async (ctx, next) => {

    await next()

    const { APICached, APIDoNotFormat } = ctx.state

    if (APIDoNotFormat) {
      return next()
    }

    // set API type
    ctx.type = "application/json"

    // check is redis cached
    APICached && ctx.set('X-Cached-By', 'redis')

    //restful API response format
    ctx.body = Object.assign({
        "status": 200,
        "result": null
      },
      { result: ctx.body },
      APICached ? { APICached: 'redis' } : null
    )
  }
}

