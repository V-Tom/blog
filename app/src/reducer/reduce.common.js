'use strict';

import {createReducer} from 'redux-immutablejs';
import {fromJS} from 'immutable';

const initialState = fromJS({});

export default createReducer(initialState, {});
