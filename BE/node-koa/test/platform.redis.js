'use strict'
const redis = require("redis")
let cache = null
exports.connect = done=> {

  cache = redis.createClient()

  cache.on('ready', ()=> {
    done()
  })

  cache.on("error", function (err) {
    done(err)
  })

}

exports.clear = done=> {
  cache.quit(done())
}