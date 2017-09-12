'use strict'

/**
 * configure
 */
const CACHE_NAME = 'my-site-cache-v1'

const urlsToCache = ['/']

/**
 * install
 */
self.addEventListener('install', event => {

  // event.registerForeignFetch({
  //   scopes: ['/'],
  //   origins: ['https://static.t-tom.me']
  // })


  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(self.skipWaiting()),
  )

})

/**
 * fetch
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response
      }

      const corsRequest = new Request(event.request, { mode: 'include' })
      return fetch(corsRequest).catch(e => console.error(`Service worker cors with error ${e}`))
    })
  )
})
