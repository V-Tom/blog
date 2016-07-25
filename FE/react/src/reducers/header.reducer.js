import {Header} from '../actions/typs'
import { createReducer } from 'redux-immutablejs'
import {fromJS} from 'immutable'

const initialState = fromJS({
    limit: 0,
    active: false
});

export default createReducer(initialState, {
    [Header.SET_HEADER_SCROLL_LIMIT]: (state, action)=> {
        return state.merge({
            limit: action.limitValue
        });
    },
    [Header.SHOW_HEADER]: (state, action)=> {
        return state.merge({
            active: false
        });
    },
    [Header.HIDE_HEADER]: (state, action)=> {
        return state.merge({
            active: true
        });
    }
});