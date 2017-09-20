'use strict'
const fs = require('fs')
const path = require('path')

const redisPrefix = 'fullStackFrontPage'
const cachePath = path.join(__dirname, '../localconfig/fullStackFrontPage.json')

/**
 * getIndexView
 */
async function getIndexView(ctx) {
  const config = await getCacheConfig()
  return await ctx.renderHTML('index', config)
}

/**
 * renderIndexView
 */
exports.renderIndexView = async (ctx, next) => {
  ctx.body = await getIndexView(ctx)
}

exports.getIndexView = getIndexView

/**
 * getCacheConfig
 * @returns {Promise.<*>}
 */
async function getCacheConfig() {

  let config = await REDIS.getCache(redisPrefix)
  if (!config) {
    config = fs.readFileSync(cachePath, 'utf8')
    config = JSON.parse(config.replace(/\r?\n|\r/g, " "))
    await REDIS.setCache(redisPrefix, config)
  }
  return config
}

exports.getCacheConfig = getCacheConfig
/**
 * updateConfigCache
 * @returns {Promise.<void>}
 */
exports.updateConfigCache = async (ctx, next) => {

  const oldCache = await REDIS.getCache(redisPrefix)
  let cache

  try {
    cache = Object.assign(oldCache || {}, ctx.request.body)
  } catch ( e ) {
    cache = oldCache || {}
  }

  fs.writeFileSync(cachePath, JSON.stringify(cache), 'utf8')

  await REDIS.removeCache(redisPrefix)
  await REDIS.setCache(redisPrefix, cache)

  ctx.body = {}
  next()
}

