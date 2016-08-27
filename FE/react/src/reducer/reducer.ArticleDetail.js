import { RouterArticle } from '../actions/typs'
import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'

import marked from '../libs/markdown/marked'

const initialState = fromJS({
  articleDetail: {
    intro: {
      pic: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    },
    tags: []
  },
  navigationArticle: '.article-content'
});

export default createReducer(initialState, {
  [RouterArticle.GET_ARTICLE_DETAIL](state, action) {
    action.articleDetail.content = marked(action.articleDetail.content);
    return state.merge({
      articleDetail: action.articleDetail
    })
  },
  [RouterArticle.CLEAR_ARTICLE_DETAIL_STATE](state){
    return state.merge({
      articleDetail: {
        intro: {
          pic: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
        },
        tags: []
      },
      navigationArticle: '.article-content',
      articleDetailReady: false,
      openArticleSideBar: false
    });
  }
});