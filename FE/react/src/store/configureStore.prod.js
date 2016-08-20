'use strict'
import { createStore } from 'redux'
import appReducer from '../reducer'

export default function configureStore(initialState) {
  return createStore(appReducer, initialState)
}