window.addEventListener('DOMContentLoaded', _ => {

  /**
   * set all target blank for href link
   */
  (function () {
    Array.from(document.querySelectorAll('a'))
      .forEach($node => $node.setAttribute('target', '_blank'))
  })();

  /**
   * Rewrite head anchor links
   */
  (function () {
    Array.from(document.querySelectorAll('#markdown [id]'))
      .forEach($node => {
        const text = $node.textContent;
        const $a = document.createElement('a');
        $a.setAttribute('href', `#${text}`);
        $a.textContent = text;
        $node.innerHTML = '';
        $node.appendChild($a)
      });

  })();

  /**
   * Copy inject my blog information
   */
  (function () {
    window.addEventListener(
      'copy',
      function (ev) {
        const text = ev.clipboardData || window.clipboardData;
        if (text && window.getSelection().toString()) {
          ev.preventDefault();
          const e = [
            '作者：Nomad or Nomand',
            "来自：Tom's Blog",
            '链接：' + window.location.href,
            '转载请注明出处~~',
            '',
            window.getSelection().toString(),
          ];
          text.setData('text/html', e.join('<br>'));
          text.setData('text/plain', e.join('\n'));
        }
      },
      false,
    );
  })();

});

if (navigator.serviceWorker && !location.host.includes('localhost')) {

  navigator.serviceWorker.register(
    location.host.includes('localhost') ? 'http://localhost:1313/sw.js' : 'https://t-tom.me/sw.js'
  ).catch(error => {
    console.error(`ServiceWorker registration failed: ${error}`);
  });

  navigator.serviceWorker.ready.then(registration => {
    console.info(
      '👏👏👏 %c Service Worker registered success. ',
      'color:#1534fa',
    );
  })
}