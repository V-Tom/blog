'use strict';

export default function(nextState, cb) {
  try {
    require.ensure(
      [],
      require => {
        cb(null, require('./Blog').default);
      },
      'Blog.router',
    );
  } catch (e) {
    console.warn('[Blog]路由加载失败');
    console.error(e);
  }
}
