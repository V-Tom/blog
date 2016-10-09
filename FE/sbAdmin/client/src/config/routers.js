'use strict'
import React from 'react'
import { Route, IndexRoute, Redirect, IndexRedirect, IndexLink } from 'react-router'

import App from '../page/App'
import ArticleManagement from '../page/router/ArticleManagement'
import Dashboard from '../page/router/Dashboard'

//PlatformStart

export default()=>
  <Route path="/" component={App}>

    <IndexRedirect to='/Article-Management'/>

    <Route path="/Dashboard" component={Dashboard}>
    </Route>

    <Route path="/Article-Management" component={ArticleManagement}>
    </Route>

  </Route>
