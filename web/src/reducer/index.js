'use strict'

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import ArticleManagement from './reducer.ArticleManagement'


const appReducer = combineReducers({
  routing: routerReducer,
  ArticleManagement,
  form: formReducer
})

export default appReducer