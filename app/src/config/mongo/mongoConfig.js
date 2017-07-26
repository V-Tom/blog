'use strict';
const mongoose = require('mongoose')

//blogCoon
const blogCoon = mongoose.createConnection(CONFIG.app.db.blog.uri)
blogCoon
  .on('error', (err)=> {
    console.error(`blogCoon ${CONFIG.app.db.blog.uri} connection failed!`, err)
    blogCoon.db.close()
  })
  .on('connected', ()=> {
    console.log(CHALK.green(`blogCoon ${CONFIG.app.db.blog.uri} connect success ...`))
  })

//userCoon
const usersCoon = mongoose.createConnection(CONFIG.app.db.users.uri)
usersCoon
  .on('error', (err)=> {
    console.error(`usersCoon  ${CONFIG.app.db.users.uri} connection failed!`, err)
    usersCoon.db.close()
  })
  .on('connected', ()=> {
    console.log(CHALK.green(`usersCoon ${CONFIG.app.db.users.uri} connect success ...`))
  })


//exports
module.exports = {
  blogCoon, usersCoon
}
