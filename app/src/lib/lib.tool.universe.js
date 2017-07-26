'use strict'

const qiniu = require('qiniu')

/**
 * qiniu
 * @type {string}
 */
qiniu.conf.ACCESS_KEY = CONFIG.app.qiniu.ACCESS_KEY
qiniu.conf.SECRET_KEY = CONFIG.app.qiniu.SECRET_KEY

const getUploadToken = () => {
  let putPolicy = new qiniu.rs.PutPolicy(CONFIG.app.qiniu.bucket)
  putPolicy.expires = CONFIG.app.qiniu.signedUrlExpires
  return putPolicy.token()
}
exports.qiniu = qiniu
exports.getUploadToken = getUploadToken
exports.uploadFileFromBuffer = function *(buffer, key) {
  const token = getUploadToken()
  return new Promise((resolve, reject) => {
    qiniu.io.put(token, key, buffer, new qiniu.io.PutExtra(), (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}