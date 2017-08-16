'use strict';
import {createStore, compose, applyMiddleware} from 'redux';
import createReducer from '../reducer';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';

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
 */
export default function configureStore(initialState) {
  const middleware = [routerMiddleware(browserHistory), thunkMiddleware];

  store = compose(applyMiddleware(...middleware))(createStore)(
    createReducer(),
    initialState,
  );
  store.asyncReducers = {};

  return store;
}
