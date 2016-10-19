'use strict';

const koa = require('koa')

//init all server global config
require('./src/init')

//koa middleware
const app = koa()
require('./src/config/koa')(app)

//koa Routes
require('./src/config/routes')(app)


// Start app
app.listen(config.app.port)
console.log(chalk.cyan(`♪ Server started, listening on port: ${config.app.port}`))
console.log(chalk.green(`Environment: ${config.app.env}`))

// Export
module.exports = app