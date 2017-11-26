'use strict'
import React from 'react'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { Router, hashHistory, browserHistory } from 'react-router'

import routers from '../config/routers'
import configureStore from '../store'
// import createDevTools from '../component/devTools/createDevTools'


export default() => {
  const initialState = window.__INITIAL_STATE__
  const store = configureStore(initialState, hashHistory)
  // createDevTools(store)
  return (
    <Provider store={store}>
      <Router history={syncHistoryWithStore(hashHistory, store)}>
        {routers()}
      </Router>
    </Provider>
  )
}