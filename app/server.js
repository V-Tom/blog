const fs = require('fs')

/**
 * require koa
 */
const koa = require('koa')

/**
 * spdy
 */
const spdy = require('spdy')

/**
 * init all server global config
 */
require('./src/init')

/**
 * koa instance
 */
const app = koa()

/**
 * experimental for ES7
 */
app.experimental = true

/**
 * index koa configure
 */
require('./src/config/koa')(app)

/**
 * koa Routes
 */
require('./src/router/routes')(app)

/**
 * spdy server
 */
const server = spdy.createServer({
  key: fs.readFileSync(`${__dirname}/t-tom.key`),
  cert: fs.readFileSync(`${__dirname}/t-tom.crt`)
}, app.callback())

/**
 * start app
 */
// server.listen(CONFIG.app.port)
app.listen(CONFIG.app.port, () => {
  console.log(CHALK.green(`♪ Server started, listening on port: ${CONFIG.app.port}`))
})