exports = module.exports = ()=> {

  return function *(next) {
    yield next

    if (this.APIDontFormat) {
      next
      return
    }

    //set API type
    this.type = "application/json"

    //set koa
    this.set('X-Powered-By', 'koa')

    this.APICached && this.set('X-Cached-By', 'redis')

    //restful API response format
    this.body = Object.assign(
      {
        "status": 0,
        "result": null
      },
      { result: this.body },
      this.APICached ? { APICached: 'REDIS' } : null)
  }
}

