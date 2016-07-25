import {ReplyContainer} from '../actions/typs'
import { createReducer } from 'redux-immutablejs'
import {fromJS} from 'immutable'

const initialState = fromJS({
    limit: 0,
    active: false
});

export default createReducer(initialState, {});