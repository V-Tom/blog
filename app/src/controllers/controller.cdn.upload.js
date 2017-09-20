'use strict'
const qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = APP.qiniu.ACCESS_KEY
qiniu.conf.SECRET_KEY = APP.qiniu.SECRET_KEY

exports.uploadFileToken = async (ctx, next) => {
  let putPolicy = new qiniu.rs.PutPolicy(APP.qiniu.bucket)
  putPolicy.expires = APP.qiniu.signedUrlExpires
  let token = putPolicy.token()

  ctx.body = {
    url: 'http://up.qiniu.com/',
    token: token
  }
  return next()
}
