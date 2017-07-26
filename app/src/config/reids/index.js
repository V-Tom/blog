'use strict'
const REDIS = require("redis")

module.exports = () => {


  const client = REDIS.createClient(CONFIG.app.redis.config)

  client.on('ready', () => {
    console.log(CHALK.green('REDIS server connect success ...'))
  })

  client.on("error", function (err) {
    console.error(CHALK.red(`REDIS error : ${err}`))
  })

  return client
}