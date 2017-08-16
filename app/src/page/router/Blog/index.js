'use strict';
import {injectAsyncReducer} from '../../../store';

export default function(nextState, cb) {
  try {
    require.ensure(
      [],
      require => {
        injectAsyncReducer({
          Blog: require('../../../reducer/reducer.Blog').default,
        });
        cb(null, require('./Blog').default);
      },
      'Blog.router',
    );
  } catch (e) {
    console.warn('[Blog]路由加载失败');
    console.error(e);
  }
}
