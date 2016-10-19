exports = module.exports = ()=> {

  return function *(next) {
    yield next

    if (this.APIDonotFormat) {
      yield next
      return
    }

    //set API type
    this.type = "application/json"

    this.APICached && this.set('X-Cached-By', 'redis')

    //restful API response format
    this.body = Object.assign(
      {
        "status": 200,
        "result": null
      },
      { result: this.body },
      this.APICached ? { APICached: 'REDIS' } : null)
  }
}

