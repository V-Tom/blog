'use strict';

/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Route, IndexRoute} from 'react-router';

/**
 * @inject
 */
import RootComponent from '../page/App';

/**
 * dynamicRouters
 */
import HomeComponent from '../page/router/Home';
import BlogComponent from '../page/router/Blog';
import ArticleComponent from '../page/router/Article';

export default {
  /**
   * base router
   */
  path: '/',
  component: RootComponent,
  /**
   * index router
   */
  indexRoute: {
    getComponent: HomeComponent,
  },
  childRoutes: [
    /**
     * me router
     */
    require('../page/router/Me'),
    /**
     * multiple blog router
     */
    {
      path: '/blog',
      getComponent: BlogComponent,
    },
    {
      path: '/blog/?tag=/:tag',
      getComponent: BlogComponent,
    },
    {
      path: '/blog/?page=/:page',
      getComponent: BlogComponent,
    },
    {
      path: '/blog/:articleId',
      getComponent: ArticleComponent,
    },
    /**
     * not found router
     */
    require('../page/router/NotFound'),
  ],
};
