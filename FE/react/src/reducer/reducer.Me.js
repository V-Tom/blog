import { Me } from '../actions/typs'
import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'
import marked from '../libs/markdown/marked'

const initialState = fromJS({
  resume: {
    data: {
      resume: 'loading'
    }
  }
});

export default createReducer(initialState, {
  [Me.GET_MY_RESUME]: (state, action)=> {
    action.data.data.resume = marked(action.data.data.resume);
    return state.merge({
      resume: action.data
    })
  }
})