'use strict';
/**
 * @official
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

/**
 * @inject
 */
import DynamicLoader from '../DynamicLoader';

const Notification = DynamicLoader({
  loader: () =>
    import(/*webpackChunkName:'Notification.Component'*/ './Notification'),
});

const NotificationHelper = Object.create(null);

NotificationHelper.show = (type, msg, cb, duration) => {
  duration = duration || 1500;
  const props = {type, msg, cb, duration};
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<Notification {...props} />, div);

  setTimeout(() => {
    div.addEventListener(
      'animationend',
      () => {
        div.parentNode.removeChild(div);
        ReactDOM.unmountComponentAtNode(div);
        props.cb && props.cb();
      },
      false,
    );

    div.querySelector('.body').classList.add('slideOutDown');

    props.callback && props.callback();
  }, props.duration);
};
export default {
  info(msg, cb, duration) {
    if (typeof cb === 'number') {
      duration = cb;
      cb = null;
    }
    return NotificationHelper.show('info', msg, cb, duration);
  },
  success(msg, cb, duration) {
    if (typeof cb === 'number') {
      duration = cb;
      cb = null;
    }
    return NotificationHelper.show('success', msg, cb, duration);
  },
  err(msg, cb, duration) {
    if (typeof cb === 'number') {
      duration = cb;
      cb = null;
    }
    return NotificationHelper.show('error', msg, cb, duration);
  },
};
