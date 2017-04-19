'use strict'

const tinify = require('tinify')
const qiniu = require('qiniu')

/**
 * tinify
 */
tinify.key = global.config.app.tinyPNG.key
const tinyUpload = (binary) => new Promise((resolve, reject) => {
  tinify.fromBuffer(new Buffer(binary, 'binary')).toBuffer((err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})

exports.tinify = tinify
exports.tinyUpload = tinyUpload

/**
 * qiniu
 * @type {string}
 */
qiniu.conf.ACCESS_KEY = config.app.qiniu.ACCESS_KEY
qiniu.conf.SECRET_KEY = config.app.qiniu.SECRET_KEY
const getUploadToken = () => {
  let putPolicy = new qiniu.rs.PutPolicy(config.app.qiniu.bucket)
  putPolicy.expires = config.app.qiniu.signedUrlExpires
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