'use strict';

import { combineReducers } from 'redux'
import Blog from './reducer.Blog'
import Header from './reducer.Header'
import Spinner from './reducer.Spinner'
import Article from './reducer.ArticleDetail'
import Discuss from './reducer.Discuss'

const appReducer = combineReducers({
  Blog,
  Header,
  Spinner,
  Article,
  Discuss
});

export default appReducer;