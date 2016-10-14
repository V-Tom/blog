'use strict';

const koa = require('koa')

//init all server global config
require('./src/init')

const app = koa()
require('./src/config/koa')(app)

// Routes
require('./src/config/routes')(app)


// Start app
app.listen(config.app.port)
console.log(chalk.cyan(`♪ Server started, listening on port: ${config.app.port}`))
console.log(chalk.green(`Environment: ${config.app.env}`))

// Export test agent
module.exports = app