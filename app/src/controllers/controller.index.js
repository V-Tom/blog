'use strict'

const frontCacheController = require('./../lib/lib.front.cache.js')

/**
 * getIndexView
 */
async function getIndexView(ctx) {
  const config = await frontCacheController.getCacheConfig()
  return await ctx.renderHTML('index', config)
}

/**
 * renderIndexView
 */
exports.renderIndexView = async (ctx, next) => {
  ctx.body = await getIndexView(ctx)
}

exports.getIndexView = getIndexView
