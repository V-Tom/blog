'use strict'
const qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = config.app.qiniu.ACCESS_KEY
qiniu.conf.SECRET_KEY = config.app.qiniu.SECRET_KEY

exports.uploadFile = function *() {
  let putPolicy = new qiniu.rs.PutPolicy(config.app.qiniu.bucket)
  putPolicy.expires = config.app.qiniu.signedUrlExpires
  let token = putPolicy.token()
  this.body = {
    url: 'http://up.qiniu.com/',
    token: token
  }
}
