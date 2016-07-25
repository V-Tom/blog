import React from 'react';
import {Route,IndexRoute,Redirect} from 'react-router'

import App from './component/App'
import Home from './component/Home'
import Blog from './component/Blog'
import ArticleDetail from './component/ArticleDetail'
import Me from './component/Me'
import NotFound from './component/404'

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
