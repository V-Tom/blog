'use strict';

/**
 * @official
 */
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @inject
 */
import RootComponent from '../page/App';
import HomeComponent from '../page/router/Home';
import BlogComponent from '../page/router/Blog';
import ArticleComponent from '../page/router/Article';

/**
 * 不要使用 static 路由
 * 这个路由在 nginx 层做了静态服务器
 */
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
    // require('../page/router/Me'),

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
