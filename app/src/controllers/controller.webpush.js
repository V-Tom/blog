'use strict'
const fs = require('fs')
const path = require('path')

const WebPush = require('../lib/lib.webpush')
const subscribeFilePath = path.resolve(__dirname, `${global.APP.configPath}/webpush.subscribelist.json`)
const redisPrefix = 'WEB_PUSH_SUBSCRIBE_LIST'

/**
 * readSubscribeFile
 * @returns {Promise.<*>}
 */
async function readSubscribeFile() {
  let file

  file = await REDIS.getCache(redisPrefix)

  if (!file) {
    file = JSON.parse(fs.readFileSync(subscribeFilePath, 'utf8').replace(/\r?\n|\r/g, " "))
    await REDIS.setCache(redisPrefix, file)
  }

  return file
}

/**
 * writeSubscribeFile
 * @param data
 * @returns {Promise.<void>}
 */
async function writeSubscribeFile(data) {

  fs.writeFileSync(subscribeFilePath, JSON.stringify(data), 'utf8')

  await REDIS.removeCache(redisPrefix)
  await REDIS.setCache(redisPrefix, data)
}

/**
 * subscribe
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
exports.subscribe = async (ctx, next) => {

  const { body } = ctx.request

  const data = await readSubscribeFile()

  data.push(body)

  await writeSubscribeFile(data)

  ctx.body = {}

  next()
}

/**
 * push
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
exports.broadcast = async (ctx, next) => {

  const { body, title, link, type } = ctx.request.body
  const data = await readSubscribeFile()

  data.forEach(subscribe => {
    WebPush.sendMessage(subscribe, JSON.stringify({
      body,
      link,
      type,
      title
    }))
  })

  ctx.body = {}

  next()
}