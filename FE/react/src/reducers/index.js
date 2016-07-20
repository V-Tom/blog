'use strict';

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import Blog from './Blog.reducer'
import Header from './header.reducer'
import Spinner from './Spinner.reducer'
import Article from './ArticleDetail.reducer'
import ReplyContainer from './Reply.container.reducer'
import ReplyBox from './Reply.box.reducer'
import ReplyList from './Reply.list.reducer'

const appReducer = combineReducers({
    Blog,
    Header,
    Spinner,
    Article,
    routing: routerReducer,
    form: formReducer
});

export default appReducer;