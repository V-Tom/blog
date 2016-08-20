const exp = process.env.NODE_ENV === "development" ? config.app.redis.redisExpDev : config.app.redis.redisExp;
const redis = require('./redis')()

module.exports.get = (key)=> {
  return new Promise((resolve, rejcect)=> {
    redis.get(key, (err, reply)=> {
      if (err) {
        resolve(err)
      }
      if (reply) {
        resolve(reply.toString())
      }
      resolve(null)
    })
  })
}

module.exports.set = (key, value)=> {
  return new Promise((resolve, reject)=> {
    redis.set(key, JSON.stringify(value), 'EX', exp, () => {
      resolve()
    })
  })
}

module.exports.del = (key)=> {
  return new Promise((resolve, reject)=> {
    redis.del(key, ()=> {
      resolve()
    })
  })
}