const crypto = require('crypto')

const config = {
  algorithm: 'aes-256-cbc',
  salt: 'abcdefghijklmnopqrstuvwxyz'
}

/**
 * randomBytes
 */
crypto.randomBytes(16, (err, buf) => {
  config.salt = buf.toString('base64')
})

/**
 * cipher
 * @param password
 * @returns {string}
 */
exports.cipher = function (password) {
  let encrypted = ""
  const cip = crypto.createCipher(config.algorithm, config.salt)
  encrypted += cip.update(password, 'utf8', 'hex')
  encrypted += cip.final('hex')
  return encrypted
}

/**
 * decipher
 * @param encrypted
 * @returns {string}
 */
exports.decipher = function (encrypted) {
  let decrypted = ""
  const decipher = crypto.createDecipher(config.algorithm, config.salt)
  decrypted += decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
