'use strict';
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

/**
 * blogCoon
 * @type {Connection|Promise}
 */
const blogCoon = mongoose.createConnection(global.APP.db.blog.uri)
blogCoon
  .on('error', (err) => {
    console.error(`blogCoon ${global.APP.db.blog.uri} connection failed!`, err)
    blogCoon.db.close()
  })
  .on('connected', () => {
    console.log(CHALK.green(`blogCoon ${global.APP.db.blog.uri} connect success ...`))
  })

/**
 * userCoon
 * @type {Connection|Promise}
 */
const usersCoon = mongoose.createConnection(global.APP.db.users.uri)
usersCoon
  .on('error', (err) => {
    console.error(`usersCoon  ${global.APP.db.users.uri} connection failed!`, err)
    usersCoon.db.close()
  })
  .on('connected', () => {
    console.log(CHALK.green(`usersCoon ${global.APP.db.users.uri} connect success ...`))
  })


//exports
module.exports = {
  blogCoon, usersCoon
}
