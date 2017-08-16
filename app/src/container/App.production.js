'use strict';
/**
 * @official
 */
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';
import {Router, hashHistory} from 'react-router';

/**
 * @inject
 */
import routes from '../config/routes';
import configureStore from '../store';

export default () => {
  const initialState = window.__INITIAL_STATE__ || {};
  const store = configureStore(initialState);
  const history = syncHistoryWithStore(hashHistory, store);

  // // normal routers
  // return (
  //   <Provider store={store}>
  //     <Router history={history}>
  //       {routes()}
  //     </Router>
  //   </Provider>
  // )

  // dynamicRouters
  return (
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>
  );
};
