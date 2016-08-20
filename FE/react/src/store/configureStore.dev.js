'use strict'
import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { persistState } from 'redux-devtools'
import createLogger from 'redux-logger'
import { Iterable } from 'immutable'
import promiseMiddleware from '../middleware/middleware.Promise'
import DevTools from '../component/DevTools'
import appReducer from '../reducer'

export default function configureStore(initialState, history) {
  const stateTransformer = (state) => {
    let newSate = {}
    Object.keys(state).forEach(x=> {
      if (Iterable.isIterable(state[x])) {
        newSate[x] = state[x].toJS()
      } else {
        newSate[x] = state[x]
      }
    })
    return newSate
  }
  let middleware = [thunkMiddleware, promiseMiddleware, routerMiddleware(history)]
  let finalCreateStore
  if (__DEVCLIENT__) {
    if (__DEVLOGGER__) {
      middleware.push(createLogger({ stateTransformer }))
    }
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : __DEVTOOLS__ ? DevTools.instrument() : f => f,
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )
  } else {
    finalCreateStore = compose(applyMiddleware(...middleware))
  }

  const store = finalCreateStore(createStore)(appReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer')
      store.replaceReducer(nextReducer)
    })
  }
  return store
}