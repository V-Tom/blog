'use strict';
import injectMarked from '../injectMarked';

export default async function(nextState, cb) {
  try {
    await injectMarked();

    return require.ensure(
      [],
      require => {
        cb(null, require('./Article').default);
      },
      'Article.router',
    );
  } catch (e) {
    console.warn('[Article]路由加载失败');
    console.error(e);
  }
}
