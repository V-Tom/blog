'use strict';
const mongoose = require('mongoose')

/**
 * blogCoon
 * @type {Connection|Promise}
 */
const blogCoon = mongoose.createConnection(global.CONFIG.app.db.blog.uri)
blogCoon
  .on('error', (err) => {
    console.error(`blogCoon ${global.CONFIG.app.db.blog.uri} connection failed!`, err)
    blogCoon.db.close()
  })
  .on('connected', () => {
    console.log(CHALK.green(`blogCoon ${global.CONFIG.app.db.blog.uri} connect success ...`))
  })

/**
 * userCoon
 * @type {Connection|Promise}
 */
const usersCoon = mongoose.createConnection(global.CONFIG.app.db.users.uri)
usersCoon
  .on('error', (err) => {
    console.error(`usersCoon  ${global.CONFIG.app.db.users.uri} connection failed!`, err)
    usersCoon.db.close()
  })
  .on('connected', () => {
    console.log(CHALK.green(`usersCoon ${global.CONFIG.app.db.users.uri} connect success ...`))
  })


//exports
module.exports = {
  blogCoon, usersCoon
}
