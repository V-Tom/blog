exports = module.exports = (restfulAPI)=> {

  const APIStatus = {
    0: restfulAPI.RESPONSE_ERROR,
    1: restfulAPI.RESPONSE_SUCCESS
  }

  return function *(next) {
    yield next

    //set API type
    this.type = "application/json"

    //restful API response format
    this.body = Object.assign({},
      APIStatus[this.APIStatus],
      {data: this.body}, {err: this.APIError}, {APICached: this.APICached})
  }
}

