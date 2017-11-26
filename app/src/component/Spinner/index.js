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

const Spinner = DynamicLoader({
  loader: () =>
    import(/*webpackChunkName:'Notification.Component'*/ './Spinner'),
});

let instance = null;

export default {
  show() {
    if (instance) {
      return false;
    }
    const div = document.createElement('div');
    document.body.appendChild(div);

    //instance cache
    instance = div;

    ReactDOM.render(<Spinner />, div);
  },
  hide() {
    let div = instance;
    if (!div) {
      return false;
    }
    instance = null;
    ReactDOM.unmountComponentAtNode(div);
    div.parentNode.removeChild(div);
  },
};
