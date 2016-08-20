import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router'

import App from '../page/App'
import NotFound from '../page/404'

import Home from '../page/router/Home'
import Blog from '../page/router/Blog'
import ArticleDetail from '../page/router/ArticleDetail'
import Me from '../page/router/Me'

export default()=>
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/blog" component={Blog}>
      <Route path="?tagName=/:tag" component={Blog}></Route>
    </Route>
    <Route path="/blog/:articleId" component={ArticleDetail}></Route>
    <Route path="/me" component={Me}></Route>
    <Route path="*" component={NotFound}></Route>
  </Route>
