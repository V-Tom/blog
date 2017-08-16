'use strict';

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

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
    form: formReducer,
    ...(asyncReducers
      ? (asyncReducers.__esModule ? asyncReducers.default : asyncReducers) : undefined),
  });
}
