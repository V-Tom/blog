'use strict';
import { injectAsyncReducer } from '../../../store';

export default async function (nextState, cb) {
  try {

    await import(/*webpackChunkName:'Prism.lib'*/ '../../../lib/markdown/prism');
    await import(/*webpackChunkName:'Markdown.css'*/ '../../../stylus/markdown/markdown.stylus');
    await import(/*webpackChunkName:'Prism.css'*/ '../../../stylus/markdown/prism.stylus');

    return require.ensure(
      [],
      require => {
        injectAsyncReducer({
          Article: require('../../../reducer/reducer.Article').default,
        });
        cb(null, require('./Article').default);
      },
      'Article.router',
    );
  } catch ( e ) {
    console.warn('[Article]路由加载失败');
    console.error(e);
  }
}
