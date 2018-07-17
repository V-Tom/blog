window.addEventListener('DOMContentLoaded', _ => {

    /**
     * set all target blank for href link
     */
    (function () {
        [].slice.call(document.querySelectorAll('a'))
            .forEach($node => $node.setAttribute('target', '_blank'))
    })();

    /**
     * Rewrite head anchor links
     */
    (function () {
        const ids = [].slice.call(document.querySelectorAll('#markdown [id]'))
        const hash = location.hash

        ids.forEach($node => {
            const text = $node.textContent;
            const $a = document.createElement('a');
            $a.setAttribute('href', `#${$node.getAttribute('id')}`);
            $a.textContent = text;
            $node.innerHTML = '';
            $node.appendChild($a)
        });

        if (hash) {
            const id = ids.find($node => $node.getAttribute('id') === hash.substr(1, hash.length))
            setTimeout(_ => id && id.nodeType === 1 && id.firstChild.click(), 500)
        }
    })();

});

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

/**
 * inject some useful methods on window
 */
(function () {

    const observerAcive = 'observer-actived'

    window.DOMObserver = function ($target, cb) {
        new IntersectionObserver(function (entries, observer) {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 && !$target.classList.contains(observerAcive)) {
                        cb && cb.call($target, $target);
                        $target.classList.add(observerAcive)
                    }
                })
            }, {
                rootMargin: '0px',
                threshold: 1.0
            }
        ).observe($target)
    }

})();

/**
 * serviceWorker
 */
(function () {
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
})();