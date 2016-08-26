'use strict'
import { Discuss } from '../actions/typs'
import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'


const initialState = fromJS({
  articleReply: {},
  articleInfo: {}
})

export default createReducer(initialState, {
  [Discuss.GET_ARTICLE_REPLY]: (state, action)=> {
    return state.merge({
      articleReply: action.data
    })
  },
  [Discuss.SET_ARTICLE_INFO]: (state, action)=> {
    return state.merge({
      articleInfo: action.data
    })
  }
})