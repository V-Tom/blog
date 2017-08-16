'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose, applyMiddleware} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import {browserHistory} from 'react-router';
import {persistState} from 'redux-devtools';
import {createLogger} from 'redux-logger';
import {Iterable} from 'immutable';
import DevTools from '../component/DevTools';
// import ApiMiddleWare from '../middleware/middleware.API'
import createReducer from '../reducer';

/**
 * local store
 * @type {null}
 */
let store = null;

/**
 * injectAsyncReducer
 * @param asyncReducers
 */
export const injectAsyncReducer = asyncReducers => {
  Object.assign(store.asyncReducers, asyncReducers);
  store.replaceReducer(createReducer(store.asyncReducers));
};

/**
 * configureStore
 * @param initialState
 * @returns {null}
 */
export default function configureStore(initialState = {}) {
  const stateTransformer = state => {
    let newSate = {};
    Object.keys(state).forEach(x => {
      if (Iterable.isIterable(state[x])) {
        newSate[x] = state[x].toJS();
      } else {
        newSate[x] = state[x];
      }
    });
    return newSate;
  };

  const myMiddleWare = [
    // ApiMiddleWare
  ];

  let finalCreateStore,
    middleware = [
      thunkMiddleware,
      routerMiddleware(browserHistory),
      ...myMiddleWare,
    ];

  if (__DEVCLIENT__) {
    if (__DEVLOGGER__) {
      middleware.push(createLogger({stateTransformer}));
    }
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension
        ? window.devToolsExtension()
        : __DEVTOOLS__ ? DevTools.instrument() : f => f,
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    );
  } else {
    finalCreateStore = compose(applyMiddleware(...middleware));
  }

  store = finalCreateStore(createStore)(createReducer(), initialState);

  if (module.hot) {
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer').default;
      store.replaceReducer(nextReducer);
    });
  }

  /**
   * for injectAsyncReducer
   * @type {{}}
   */
  store.asyncReducers = {};

  return store;
}
