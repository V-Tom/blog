'use strict'

const frontCacheController = require('./../lib/lib.front.cache.js')

/**
 * index page
 */
module.exports.renderIndexView = async (ctx, next) => {
  const config = await frontCacheController.getCacheConfig()
  ctx.body = await ctx.renderHTML('index', config)
  return next()
}
