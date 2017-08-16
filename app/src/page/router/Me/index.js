'use strict';
import {injectAsyncReducer} from '../../../store';

module.exports = {
  path: '/me',
  getComponent: async (nextState, cb) => {

    await import(/*webpackChunkName:'Prism.lib'*/ '../../../lib/markdown/prism');
    await import(/*webpackChunkName:'Markdown.css'*/ '../../../stylus/markdown/markdown.stylus');
    await import(/*webpackChunkName:'Prism.css'*/ '../../../stylus/markdown/prism.stylus');

    try {
     return  require.ensure(
        [],
        require => {
          cb(null, require('./Me').default);
        },
        'Me.router',
      );
    } catch (e) {
      console.warn('[NotFound]路由加载失败');
      console.error(e);
    }
  },
};
