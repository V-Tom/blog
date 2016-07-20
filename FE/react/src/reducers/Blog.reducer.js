import {RouterBlog} from '../actions/typs'
import { createReducer } from 'redux-immutablejs'
import {fromJS} from 'immutable'


const initialState = fromJS({
    isMore: true,
    tagName: undefined,
    articleList: []
});

export default createReducer(initialState, {
    [RouterBlog.GET_ARTICLE_LIST]: (state, action, isMerge)=> {
        return state.merge({
            isMore: true,
            articleList: action.articleList
        });
    }
});