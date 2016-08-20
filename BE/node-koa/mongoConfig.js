'use strict';
const mongoose = require('mongoose')


//blogCoon
const blogCoon = mongoose.createConnection(config.app.db.blog.uri)
blogCoon.on('error', function (err) {
  console.error(`blogCoon ${config.app.db.blog.uri} connection failed!`, err)
  blogCoon.db.close()
})
  .on('connected', function () {
    console.log(`blogCoon ${config.app.db.blog.uri} connect success ...`)
  })

//userCoon
const usersCoon = mongoose.createConnection(config.app.db.users.uri)
usersCoon.on('error', function (err) {
  console.error(`usersCoon  ${config.app.db.users.uri} connection failed!`, err)
  usersCoon.db.close()
})
  .on('connected', function () {
    console.log(`usersCoon ${config.app.db.users.uri} connect success ...`)
  })


//exports
module.exports = {
  blogCoon, usersCoon
}
