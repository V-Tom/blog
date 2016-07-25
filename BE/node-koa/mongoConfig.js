'use strict';
const mongoose = require('mongoose')


//blogCoon
const blogCoon = mongoose.createConnection(global.config.app.db.blog.uri)
blogCoon.on('error', function (err) {
  console.error(`blogCoon ${global.config.app.db.blog.uri} connection failed!`, err)
  blogCoon.db.close()
})
  .on('connected', function () {
    console.log(`blogCoon ${global.config.app.db.blog.uri} connect success ...`)
  })

//blogCoon
const usersCoon = mongoose.createConnection(global.config.app.db.users.uri)
usersCoon.on('error', function (err) {
  console.error(`usersCoon  ${global.config.app.db.users.uri} connection failed!`, err)
  usersCoon.db.close()
})
  .on('connected', function () {
    console.log(`usersCoon ${global.config.app.db.users.uri} connect success ...`)
  })


//exports
module.exports = {
  blogCoon, usersCoon
}
