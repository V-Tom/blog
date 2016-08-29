'use strict'
import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { Router, browserHistory } from 'react-router'

import routes from '../config/routes'
import configureStore from '../store'


export default()=> {
  const store = configureStore({}, browserHistory);
  return (
    <Provider store={store}>
      <Router history={ syncHistoryWithStore(browserHistory, store)}>
        {routes()}
      </Router>
    </Provider>
  )
}
