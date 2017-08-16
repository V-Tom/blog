'use strict';

/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

/**
 * @inject
 */
import routes from '../config/routes';
import configureStore from '../store';

export default () => {
  const initialState = window.__INITIAL_STATE__ || {};
  const store = configureStore(initialState);
  const history = syncHistoryWithStore(browserHistory, store);

  return (
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>
  );
};
