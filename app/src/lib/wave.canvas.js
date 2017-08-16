'use strict';
/*!* wave-canvas.js */
!(function() {
  var e = (function() {
    var e,
      i,
      t,
      o,
      n,
      a,
      s,
      r,
      c,
      l,
      h,
      p,
      d,
      u,
      g,
      v = function() {
        if (document.querySelectorAll('.m-header').length)
          if (
            (
              (o =
                window.devicePixelRatio && cssua.ua.mobile
                  ? window.devicePixelRatio
                  : 1),
              (e = $(window)),
              (i = $('.m-header')),
              i.append('<canvas id="wave-canvas"></canvas>'),
              (n = document.getElementById('wave-canvas')),
              (t = new createjs.Stage(n)),
              (a = new createjs.Shape()),
              createjs.Ticker.setFPS(30),
              createjs.Ticker.addEventListener('tick', t),
              (r = n.height - n.height / 2.7),
              (c = n.height / 6.5),
              (l = 60),
              (h = 0.41),
              (p = 2.5),
              (d = 340),
              (u = 2 * Math.PI / d),
              (g = 10),
              Modernizr.canvas
            )
          ) {
            w();
            var s = _.throttle(f, 100);
            e.on('resize', s), f();
          } else $(n).remove();
      },
      f = function() {
        if (
          (
            (n.width = i.width() + 2),
            (n.height = i.outerHeight()),
            (r = n.height - n.height / 2.7),
            (c = n.height / 7.5),
            (h = 0.41),
            (p = 2.5),
            n.width / o < 680
              ? (
                  (s = new m()),
                  (r = n.height - 10),
                  (p = 3.8),
                  (h = 0.2),
                  (c = 45)
                )
              : (s = new m()),
            window.devicePixelRatio && cssua.ua.mobile
          )
        ) {
          var e = n.getAttribute('height'),
            a = n.getAttribute('width');
          n.setAttribute(
            'width',
            Math.round(a * window.devicePixelRatio),
          ), n.setAttribute(
            'height',
            Math.round(e * window.devicePixelRatio),
          ), (n.style.width = a + 'px'), (n.style.height =
            e + 'px'), (t.scaleX = t.scaleY = window.devicePixelRatio);
        }
      },
      w = function() {
        (s = new m()), t.addChild(a), C();
      },
      m = function() {
        (this.amp =
          10 + 12 * Math.random()), (this.freq = 0.0044), (this.phase =
          2 + 4 * Math.random()), (this.offset =
          2 + 4 * Math.random()), n.width / o < 680 &&
          (
            (this.amp = 2 + 6 * Math.random()),
            (this.freq = 0.018),
            (this.phase = 1 + 2 * Math.random()),
            (this.offset = 1 + 2 * Math.random())
          ), (this.point = function(e) {
          return (
            r -
            A() +
            this.offset +
            this.amp * Math.sin(this.freq * e + this.phase + u * g)
          );
        });
      },
      A = function() {
        var e = new Date();
        return (
          c / 2 * Math.abs(e.getSeconds() + e.getMilliseconds() / 1e3 - 30) / 30
        );
      },
      C = function() {
        a.graphics.clear(), a.graphics.beginFill('#fff');
        for (var e = 0; e < n.width + 2; e++)
          a.graphics.lineTo(e, (s.point(e) * p + s.point(e)) * h);
        a.graphics.lineTo(n.width, n.height), a.graphics.lineTo(
          0,
          n.height,
        ), a.graphics.closePath(), a.graphics.endFill(), (g =
          (g - 1) % d), t.update(), setTimeout(C, 1e3 / l);
      };
    return {initialize: v};
  })();
  e.initialize();
})();
