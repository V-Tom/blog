'use strict';

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

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
  Discuss,
  routing: routerReducer,
  form: formReducer
});

export default appReducer;