const exp = process.env.NODE_ENV === "development" ? global.config.app.redis.redisExpDev : global.config.app.redis.redisExp;
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
      resolve(value)
    })
  })
}