import {RouterArticle} from '../actions/typs'
import { createReducer } from 'redux-immutablejs'
import {fromJS} from 'immutable'

import marked from '../libs/markdown/marked'

const initialState = fromJS({
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

export default createReducer(initialState, {
    [RouterArticle.GET_ARTICLE_DETAIL](state, action) {
        action.articleDetail.content = marked(action.articleDetail.content);
        return state.merge({
            articleDetail: action.articleDetail
        })
    },
    [RouterArticle.SET_ARTICLE_DETAIL_READY](state, action) {
        return state.merge({
            articleDetailReady: true
        })
    },
    [RouterArticle.TOGGLE_ARTICLE_SIDE_BAR](state, action) {
        return state.merge({
            openArticleSideBar: !state.get("openArticleSideBar")
        })
    },
    [RouterArticle.RESET_ARTICLE_DETAIL_READY] (state) {
        return state.merge({
            articleDetailReady: false
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