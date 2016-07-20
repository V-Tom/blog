import {Spinner} from '../actions/typs'
import { createReducer } from 'redux-immutablejs'
import {fromJS} from 'immutable'

const initialState = fromJS({
    show: false
});

export default createReducer(initialState, {
    [Spinner.SHOW_SPINNER]: (state, action)=> {
        return state.merge({
            show: true
        });
    },
    [Spinner.HIDE_SPINNER]: (state, action)=> {
        return state.merge({
            show: false
        });
    }
});