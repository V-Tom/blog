'use strict'
const redis = require("redis")

module.exports = () => {


  const client = redis.createClient({
    host: '0.0.0.0',
    password: "zhangchi123ZC"
  })

  client.on('ready', () => {
    console.log(chalk.green('redis server connect success ...'))
  })

  client.on("error", function (err) {
    console.error(chalk.red(`redis error : ${err}`))
  })

  return client
}