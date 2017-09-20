/**
 * SERICE WORKER
 * @AUTHOR:iamnomand@gmail.com
 */

/**
 * configure
 */
const HOST_NAME = location.host
const VERSION_NAME = 'CACHE-v2'
const CACHE_NAME = HOST_NAME + '-' + VERSION_NAME
const CACHE_HOST = ['https://static.t-tom.me']

/**
 * tools
 */

// const isValidResponse = response => response && response.status >= 200 && response.status < 400
// what the fucking that why the reponse status always be 0
const isValidResponse = response => true

const isShouldBeCachedURI = ({ method, url }) => {
  return method.toUpperCase() === 'GET' && CACHE_HOST.some(host => url.search(host) !== -1)
}

/**
 * install
 */
self.addEventListener('install', event => {

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function () { self.skipWaiting() })
      .then(function () { console.log('Service worker success') })
      .catch(e => console.error(`Service worker install failed with error : ${e}`))
  )
})

/**
 * activate
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            // Remove expired cache response
            if (!CACHE_NAME.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function () {
        self.clients.claim();
      })
  );
});

/**
 * fetch
 */
async function handleFetchRequest(event) {

  const { method, url } = event.request

  /**
   * cache
   */
  if (isShouldBeCachedURI(event.request)) {

    const request = url.search(HOST_NAME) === -1 ? new Request(url, { mode: 'cors' }) : event.request

    return caches.match(event.request).then(function (response) {

      /**
       * Cache hit - return response
       */
      if (response) {
        console.log(`⚡️⚡️⚡️ %c Service Worker hit : ${url}`, "color:#38f")
        return response
      }

      /**
       * Return fetch response
       */
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then(function (response) {
          /**
           * Check if we received an valid response
           */
          if (isValidResponse(response)) {

            const clonedResponse = response.clone();

            caches
              .open(CACHE_NAME)
              .then(cache => cache.put(event.request, clonedResponse));
          }

          return response;
        })
        .catch(e => {
          console.log(`😭😭😭 %c Service Worker fetch failed,Please report to me: ${url}`, "color:#red")
        })
    })
  } else {
    return fetch(event.request).catch(e => {
      console.log(`😒😒😒 %c Service Worker can\'t hold this fetch(May be FUCKING great wall: ${url}`, "color:#ffeb7")
    })
  }
}

self.addEventListener('fetch', event => {
  event.respondWith(handleFetchRequest(event))
})

/**
 * push
 */
self.addEventListener('push', event => {
  const payload = event.data ? event.data.text() : '{}'

  const { body, title, link, type } = JSON.parse(payload)

  event.waitUntil(self.registration.showNotification(title, {
    body,
    data: link,
    icon: ''
  }))
});

/**
 * notificationclick
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});


/**
 * pushsubscriptionchange
 */
const webPushSubscribeAPI = 'https://t-tom.me/api/v1/webpush/subscribe'

self.addEventListener('pushsubscriptionchange', event => {

  const encodeStr = str => btoa(String.fromCharCode.apply(null, new Uint8Array(str)));
  const getEncodeSubscriptionInfo = (subscription, type) => subscription.getKey ? encodeStr(subscription.getKey(type)) : '';

  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(subscription => {

        const endpoint = subscription.endpoint
        const p256dh = getEncodeSubscriptionInfo(subscription, 'p256dh')
        const auth = getEncodeSubscriptionInfo(subscription, 'auth')

        const clientSubscription = { endpoint, keys: { p256dh, auth } }

        const options = {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clientSubscription)
        }
        console.log(JSON.stringify(clientSubscription))
        // return fetch(webPushSubscribeAPI, JSON.stringify(options))

      })
  )
})
