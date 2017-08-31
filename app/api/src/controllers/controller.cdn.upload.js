'use strict'
const qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = CONFIG.app.qiniu.ACCESS_KEY
qiniu.conf.SECRET_KEY = CONFIG.app.qiniu.SECRET_KEY

exports.uploadFileToken = async (ctx, next) => {
  let putPolicy = new qiniu.rs.PutPolicy(CONFIG.app.qiniu.bucket)
  putPolicy.expires = CONFIG.app.qiniu.signedUrlExpires
  let token = putPolicy.token()

  ctx.body = {
    url: 'http://up.qiniu.com/',
    token: token
  }
  return next()
}
