const fs = require('fs')
const path = require('path')

const redisPrefix = 'fullStackFrontPage'
const cachePath = path.join(__dirname, '../config/fullStackFrontPage.json')

/**
 * set cache
 * @returns {*}
 */
exports.getCacheConfig = function* () {
  let CONFIG = yield REDIS.getCache(redisPrefix)
  if (!CONFIG) {
    CONFIG = fs.readFileSync(cachePath, 'utf8')
    CONFIG = JSON.parse(CONFIG.replace(/\r?\n|\r/g, " "))
    yield REDIS.setCache(redisPrefix, CONFIG)
  }
  return CONFIG
}

/**
 * remove cache
 */
exports.updateConfigCache = function* () {
  const args = this.request.body
  yield REDIS.removeCache(redisPrefix)
  fs.writeFileSync(cachePath, JSON.stringify(args), 'utf8')
}