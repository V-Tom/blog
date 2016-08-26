'use strict'
import 'whatwg-fetch';
class Fetch {
  constructor() {
    this.interceptors = {
      request: {
        use: (use) => {
          if (Object.prototype.toString.call(use) === "[object Function]") this.conifg = Object.assign({}, this.conifg, use(this.conifg))
        }
      },
      response: {
        default: function (resonse) {
          return Promise.resolve(resonse)
        },
        use: (use) => {
          this.interceptors.response.default = use
        }
      }
    }
    this.defaults = {
      baseURL: '/',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    this.conifg = {
      timeout: 5000
    }
  }

  setHeader(key, value) {
    this.defaults.headers[key] = value
    return this
  }

  removeHeader(key) {
    delete this.defaults.headers[key]
    return this
  }

  __checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  }

  __fetchData(method, url, data) {
    return new Promise((resolve, reject)=> {
      fetch(`${this.defaults.baseURL}${url}`, Object.assign({
          method: method.toUpperCase(),
          headers: this.defaults.headers
        }, data ? { body: JSON.stringify(data) } : {}
      )).then(response=>resolve(response))
        .catch(response=>reject(response))
    })
  }

  __checkTimeout() {
    return new Promise((resolve, reject)=> {
      setTimeout(() => reject({
        err: 'Fetch request network timeout'
      }), this.conifg.timeout)
    })
  }

  http(method, url, data) {
    return Promise.race([
      this.__fetchData(method, url, data),
      this.__checkTimeout()]
    ).then(response=>this.__checkStatus(response))
      .then(response=> {
        return new Promise(resolve=> {
          response.json().then(data=> {
            resolve(Object.assign({}, { data }, { response }))
          })
        })
      })
      .then(response=>this.interceptors.response.default(response))
  }
}

export default new Fetch()