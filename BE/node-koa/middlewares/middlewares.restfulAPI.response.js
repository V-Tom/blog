exports = module.exports = (restfulAPI)=> {

  const APIStatus = {
    0: restfulAPI.RESPONSE_ERROR,
    1: restfulAPI.RESPONSE_SUCCESS,
    2: restfulAPI.RESPONSE_TOKEN_EXPIRED
  }

  return function *(next) {
    yield next

    //set API type
    this.type = "application/json"

    //restful API response format
    this.body = Object.assign({},
      APIStatus[this.APIStatus],
      this.body ? {data: this.body} : {},
      this.APIError ? {error: this.APIError} : {},
      this.APICached ? {APICached: this.APICached} : {})
  }
}

