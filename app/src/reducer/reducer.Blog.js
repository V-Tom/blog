'use strict';

import {RouterBlog} from '../actions/typs';
import {createReducer} from 'redux-immutablejs';
import {fromJS} from 'immutable';

const initialState = fromJS({
  isMore: true,
  articleList: {},
});

export default createReducer(initialState, {
  [RouterBlog.GET_ARTICLE_LIST](state, {data}) {
    return state.merge({
      isMore: true,
      articleList: data,
    });
  },
  [RouterBlog.CLEAR_BLOG_LIST_STATE](state, action) {
    return state.merge({
      isMore: false,
      articleList: {},
    });
  },
});
