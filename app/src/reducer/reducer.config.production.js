'use strict';

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

/**
 * reducer
 */
import Common from './reduce.common';

/**
 * createReducer
 * @param asyncReducers
 * @returns {Reducer<S>}
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    Common,
    routing: routerReducer,
    ...(asyncReducers
      ? (asyncReducers.__esModule ? asyncReducers.default : asyncReducers)
      : undefined),
  });
}
