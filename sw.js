const VERSION_NAME = 'CACHE-v1576942162549';
/**
 * PROJECT:  gh-pages
 * AUTHOR:  Nomand
 *     TIME:  2018-04-24
 *   EMAIL:  iamnomand@gmail.com
 **/

const HOST_NAME = location.host;
const CACHE_NAME = HOST_NAME + '-' + VERSION_NAME;
const CACHE_HOST = ['https://hasaki.xyz/', 'http://localhost:1313/', 'http://cdnjs.cloudflare.com/', 'https://cdnjs.cloudflare.com/', 'https://fonts.gstatic.com/', 'https://fonts.googleapis.com/'];

const isValidResponse = _ => true;
const isShouldBeCachedURI = ({ method, url }) => {
  return (
    method.toUpperCase() === 'GET' &&
    CACHE_HOST.some(host => url.search(host) !== -1)
  );
};

/**
 * install
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function () {
        self.skipWaiting();
      })
      .then(function () {
        console.log('Service worker success');
      })
      .catch(e =>
        console.error(`Service worker install failed with error : ${e}`),
      ),
  );
});

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
            if (!CACHE_NAME.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(function () {
        self.clients.claim();
      }),
  );
});

/**
 * fetch
 */
self.addEventListener('fetch', event => {
  event.respondWith(handleFetchRequest(event));
});

async function handleFetchRequest(event) {

  const { method, url } = event.request;

  if (isShouldBeCachedURI(event.request)) {

    return caches.match(event.request).then(function (response) {

      /**
       * Cache hit - return response
       */
      if (response) {
        console.log(`⚡️⚡️⚡️ %c Service Worker hit : ${url}`, 'color:#38f');
        return response;
      }

      /**
       * Return fetch response
       */
      const fetchRequest = event.request.clone();

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
          console.log(
            `😭😭😭 %c Service Worker fetch failed,Please report to me: ${url}`,
            'color:#red',
          );
        });
    })

  } else {

    return fetch(event.request).catch(e => {
      console.log(
        `😒😒😒 %c Service Worker can\'t hold this fetch(May be FUCKING great wall: ${url}`,
        'color:#ffeb7',
      );
    });
  }
}