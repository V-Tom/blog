'use strict'

import { Axios } from 'axios'
import { restfulAPI, TOKEN } from '../config'
import cloneDeep from 'lodash.clonedeep'

class AxiosAlpha extends Axios {
  constructor() {
    super()
    const { API_ROOT, TOKEN } = restfulAPI
    this.defaults = cloneDeep(this.defaults)

    this.defaults.baseURL = API_ROOT
    this.defaults.withCredentials = false
    this.defaults.headers.token = TOKEN

// Add a request interceptor
    this.interceptors.request.use(config=> {
      // Do something before request is sent
      return config
    }, error=> {
      // Do something with request error
      return Promise.reject(error)
    })

// Add a response interceptor
    this.interceptors.response.use(response=> {


      //response status must be 200
      //response statusText must be 'OK'
      if (response.status === 200 && response.statusText === 'OK') {
        return response.data.result
      }

      return Promise.reject(response.data)

    }, error=> {

      // Do something with response error
      return Promise.reject(error)

    })
  }
}

export default new AxiosAlpha()