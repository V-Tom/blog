const exp = config.app.env === "development" ? config.app.redis.redisExpDev : config.app.redis.redisExp;
const redis = require('./redis')()

module.exports.getCache = (key)=> {
  return new Promise((resolve, rejcect)=> {
    redis.get(key, (err, reply)=> {
      if (err) {
        resolve(err)
      }
      if (reply) {
        try {
          resolve(JSON.parse(reply.toString()))
        } catch ( e ) {
          resolve(null)
        }
      }
      resolve(null)
    })
  })
}

module.exports.setCache = (key, value)=> {
  return new Promise((resolve, reject)=> {
    redis.set(key, JSON.stringify(value), 'EX', exp, () => {
      resolve()
    })
  })
}

module.exports.removeCache = (key)=> {
  return new Promise((resolve, reject)=> {
    redis.del(key, ()=> {
      resolve()
    })
  })
}