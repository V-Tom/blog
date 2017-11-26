'use strict';
if (process.env.NODE_ENV === 'development') {
  module.exports = {
    restfulAPI: {
      // API_ROOT: 'https://0.0.0.0:4000/api/',
      API_ROOT: 'https://t-tom.me/api/',
      API_VERSION: 'v1',
      DO_NOT_INTERCEPTOR_PORT: ['http://up.qiniu.com/'],
    },
  };
} else {
  module.exports = {
    restfulAPI: {
      API_ROOT: 'https://t-tom.me/api/',
      API_VERSION: 'v1',
      DO_NOT_INTERCEPTOR_PORT: ['http://up.qiniu.com/'],
    },
  };
}
