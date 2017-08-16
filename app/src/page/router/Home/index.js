'use strict';
import {injectAsyncReducer} from '../../../store';

export default async function(nextState, cb) {
  try {
    require.ensure(
      [],
      require => {
        cb(null, require('./Home').default);
      },
      'Home.router',
    );
  } catch (e) {
    console.warn('[Home]路由加载失败');
    console.error(e);
  }
}
