const exp = process.env.NODE_ENV === "development" ? CONFIG.app.redis.redisExpDev : CONFIG.app.redis.redisExp;
const REDIS = require('./index')()

/**
 * get cache
 * @param key
 * @returns {Promise}
 */
module.exports.getCache = (key) => {
  return new Promise((resolve, rejcect) => {
    REDIS.get(key, (err, reply) => {
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

/**
 * set cache
 * @param key
 * @param value
 * @returns {Promise}
 */
module.exports.setCache = (key, value) => {
  return new Promise((resolve, reject) => {
    REDIS.set(key, JSON.stringify(value), 'EX', exp, () => {
      resolve()
    })
  })
}

/**
 * remove cache
 * @param key
 * @returns {Promise}
 */
module.exports.removeCache = (key) => {
  return new Promise((resolve, reject) => {
    REDIS.del(key, () => {
      resolve()
    })
  })
}

/**
 * send command
 * @param command
 */
module.exports.sendCommand = (command, args = []) => new Promise((resolve, reject) => {
  REDIS.send_command(command, args, function (err, caches) {
    if (err) {
      reject(err)
    } else {
      resolve(caches)
    }
  })
})
