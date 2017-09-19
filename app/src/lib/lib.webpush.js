'use strict'
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys()
/**
 * keys
 */
exports.keys = vapidKeys

webpush.setGCMAPIKey(global.CONFIG.gcm.key)

webpush.setVapidDetails(
  'mailto:t-tom@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

/**
 * sendMessage
 * @param message
 */
exports.sendMessage = function (message) {

}
