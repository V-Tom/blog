'use strict';
import injectMarked from '../injectMarked';

module.exports = {
  path: '/me',
  getComponent: async (nextState, cb) => {
    await injectMarked();

    try {
      return require.ensure(
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
