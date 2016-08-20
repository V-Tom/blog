exports = module.exports = ()=> {

  return function *(next) {
    yield next

    //set API type
    this.type = "application/json"

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

