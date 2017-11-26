'use strict'

import { createStore, compose, applyMiddleware } from 'redux'
import appReducer from '../reducer'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'

export default function configureStore(initialState, history) {
  let middleware = [routerMiddleware(history), thunkMiddleware]
  return compose(applyMiddleware(...middleware))(createStore)(appReducer, initialState)
}