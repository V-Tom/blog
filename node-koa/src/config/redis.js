'use strict'
const redis = require("redis")

module.exports = ()=> {


  const client = redis.createClient({
    password: "zhangchi123ZC"
  })

  client.on('ready', ()=> {
    console.log(chalk.green('redis server connect success ...'))
  })

  client.on("error", function (err) {
    console.error(`redis error : ${err}`)
  })

  return client
}