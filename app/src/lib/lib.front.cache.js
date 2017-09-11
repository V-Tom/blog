const redisPrefix = 'fullStackFrontPage'

const fs = require('fs')
const path = require('path')

const cachePath = path.join(__dirname, '../fullStackFrontPage.json')

/**
 * getCacheConfig
 * @returns {Promise.<*>}
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
 * updateConfigCache
 * @returns {Promise.<void>}
 */
exports.updateConfigCache = async () => {

  const oldCache = await REDIS.getCache(redisPrefix)
  let cache

  try {
    cache = Object.assign(JSON.stringify(this.request.body), oldCache || {})
  } catch ( e ) {
    cache = Object.assign(JSON.stringify({}), oldCache || {})
  }

  await REDIS.removeCache(redisPrefix)
  fs.writeFileSync(cachePath, cache, 'utf8')
  await REDIS.setCache(redisPrefix, cache)
}
