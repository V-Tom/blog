/**
 * serviceWorker register
 */

const webPushSubscribeAPI = 'https://t-tom.me/api/v1/webpush/subscribe';

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('https://t-tom.me/sw.js').catch(error => {
    console.error(`ServiceWorker registration failed: ${error}`);
  });

  navigator.serviceWorker.ready.then(registration => {
    console.info(
      '👏👏👏 %c Service Worker registered success. ',
      'color:#1534fa',
    );

    registration.pushManager
      .getSubscription()
      .then(
        subscription =>
          subscription ||
          registration.pushManager.subscribe({userVisibleOnly: true}),
      )
      .then(subscription => {
        const encodeStr = str =>
          btoa(String.fromCharCode.apply(null, new Uint8Array(str)));

        const getEncodeSubscriptionInfo = (subscription, type) =>
          subscription.getKey ? encodeStr(subscription.getKey(type)) : '';

        const endpoint = subscription.endpoint;
        const p256dh = getEncodeSubscriptionInfo(subscription, 'p256dh');
        const auth = getEncodeSubscriptionInfo(subscription, 'auth');
        const clientSubscription = {endpoint, keys: {p256dh, auth}};

        const options = {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientSubscription),
        };
        return fetch(webPushSubscribeAPI, options)
          .then(_ =>
            console.info(
              '👏👏👏 %c PushManager Worker registered success. ',
              'color:#1534fa',
            ),
          )
          .catch(_ =>
            console.info(
              '%c PushManager Worker subscribe failed. ',
              'color:#f00',
            ),
          );
      })
      .catch(e =>
        console.info('%c PushManager Worker registered failed. ', 'color:#f00'),
      );
  });
}
