'use strict'
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys()
/**
 * keys
 */
exports.keys = vapidKeys

webpush.setGCMAPIKey(global.APP.gcm.key)

webpush.setVapidDetails(
  'mailto:913984980@qq.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

/**
 * sendMessage
 * @param subscription
 * @param message
 */
exports.sendMessage = function (subscription, message) {
  return webpush.sendNotification(subscription, message)
}
