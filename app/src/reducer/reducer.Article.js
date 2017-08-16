'use strict';

import {RouterArticle} from '../actions/typs';
import {createReducer} from 'redux-immutablejs';
import {fromJS} from 'immutable';

const initialState = fromJS({
  articleDetail: {
    intro: {
      pic: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
    },
    tags: [],
  },
  navigationArticle: '.article-content',
});

export default createReducer(initialState, {
  /**
   * 获取文章详情
   * @param state
   * @param action
   */
  [RouterArticle.GET_ARTICLE_DETAIL](state, action) {
    return state.merge({
      articleDetail: action.articleDetail,
    });
  },
  /**
   * 清理 state
   * @param state
   */
  [RouterArticle.CLEAR_ARTICLE_DETAIL_STATE](state) {
    return state.merge({
      articleDetail: {
        intro: {
          pic: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
        },
        tags: [],
      },
      navigationArticle: '.article-content',
      articleDetailReady: false,
      openArticleSideBar: false,
    });
  },
});
