'use strict';

/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @inject
 */
import './Home.stylus';

export default class Index extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /**
   * paint
   * @private
   */
  __paint() {
    document.addEventListener('touchmove', function(e) {
      e.preventDefault();
    });
    let c = ReactDOM.findDOMNode(this.refs.canvas),
      x = c.getContext('2d'),
      pr = 1,
      w = window.innerWidth,
      h = window.innerHeight,
      f = 50,
      q,
      m = Math,
      r = 0,
      u = m.PI * 2,
      v = m.cos,
      z = m.random,
      linkX,
      linkY,
      linkFontSize,
      linkText = 'Reprinted from http://evanyou.me',
      linkWidth,
      goLink = false;
    c.width = w * pr;
    c.height = h * pr - 60;
    x.scale(pr, pr);
    x.globalAlpha = 0.6;
    function i() {
      if (goLink) {
        goLink = false;
        window.open('http://evanyou.me');
      } else {
        x.clearRect(0, 0, w, h);
        q = [{x: 0, y: h * 0.7 + f}, {x: 0, y: h * 0.7 - f}];
        while (q[1].x < w + f) d(q[0], q[1]);
        x.textAlign = 'center';
        x.font = '1.6rem Microsoft JhengHei';
        x.fillText('Hello Full Stack DEV', c.width / 2, c.height / 2 - 50);
        linkFontSize = 12;
        linkX = c.width - 40;
        linkY = c.height - 10;
        x.font = '14px sans-serif';
        x.textAlign = 'right';
        x.fillText(linkText, linkX, linkY);
        x.fillStyle = '#000';
        x.fillText('Nomand', linkX, linkY - 20);
        linkWidth = x.measureText(linkText).width;
      }
    }

    function d(i, j) {
      x.beginPath();
      x.moveTo(i.x, i.y);
      x.lineTo(j.x, j.y);
      var k = j.x + (z() * 2 - 0.25) * f,
        n = y(j.y);
      x.lineTo(k, n);
      x.closePath();
      r -= u / -50;
      x.fillStyle =
        '#' +
        (((v(r) * 127 + 128) << 16) |
          ((v(r + u / 3) * 127 + 128) << 8) |
          (v(r + u / 3 * 2) * 127 + 128)).toString(16);
      x.fill();
      q[0] = q[1];
      q[1] = {x: k, y: n};
    }

    function y(p) {
      var t = p + (z() * 2 - 1.1) * f;
      return t > h || t < 0 ? y(p) : t;
    }

    const isGoToLink = ev => {
      var x = ev.screenX,
        y = ev.screenY;
      if (ev.layerX || ev.layerX == 0) {
        //for firefox
        x = ev.layerX;
        y = ev.layerY;
      }
      if (
        x >= linkX - linkWidth &&
        x <= linkX + linkWidth &&
        y <= linkY &&
        y >= linkY - linkFontSize
      ) {
        return true;
      }
      return false;
    };

    function move(ev) {
      if (isGoToLink(ev)) {
        document.body.style.cursor = 'pointer';
        goLink = true;
      } else {
        document.body.style.cursor = '';
        goLink = false;
      }
    }

    this.eventClick = ev => {
      if (ev.target.nodeName === 'CANVAS') {
        if (isGoToLink(ev)) {
          window.open('http://evanyou.me');
        } else {
          i();
        }
      }
    };
    document.addEventListener('click', this.eventClick, false);
    document.addEventListener('touchstart', this.eventClick, false);
    c.addEventListener('mousemove', move, false);
    i();
  }

  componentDidMount() {
    this.__paint();
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.eventClick);
    document.removeEventListener('touchstart', this.eventClick);
  }

  render() {
    return <canvas className="home-canvas" ref="canvas" />;
  }
}
