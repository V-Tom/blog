'use strict';
import {injectAsyncReducer} from '../../../store';

module.exports = {
  path: '*',
  getComponent(nextState, cb) {
    try {
      require.ensure(
        [],
        require => {
          cb(null, require('./NotFound').default);
        },
        'NotFound.router',
      );
    } catch (e) {
      console.warn('[NotFound]路由加载失败');
      console.error(e);
    }
  },
};
