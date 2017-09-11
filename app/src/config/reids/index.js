'use strict'
const redis = require("redis")

module.exports = () => {


  const client = redis.createClient(CONFIG.app.redis.config)

  client.on('ready', () => {
    console.log(CHALK.green('redis server connect success ...'))
  })

  client.on("error", function (err) {
    console.error(CHALK.red(`redis error : ${err}`))
  })

  return client
}