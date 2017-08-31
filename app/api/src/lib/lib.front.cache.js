const redisPrefix = 'fullStackFrontPage'

const fs = require('fs')
const path = require('path')

const cachePath = path.join(__dirname, '../config/fullStackFrontPage.json')
/**
 * set cache
 * @returns {*}
 */
exports.getCacheConfig = async () => {
  let config = await REDIS.getCache(redisPrefix)
  if (!config) {
    config = fs.readFileSync(cachePath, 'utf8')
    config = JSON.parse(config.replace(/\r?\n|\r/g, " "))
    await REDIS.setCache(redisPrefix, config)
  }
  return config
}

/**
 * remove cache
 */
exports.updateConfigCache = function *() {
  yield REDIS.removeCache(redisPrefix)
  let { vendorCDN, jsCDN, cssCDN } = this.request.body
  fs.writeFileSync(cachePath, JSON.stringify({ vendorCDN, jsCDN, cssCDN }), 'utf8')
}