'use strict';

import {MyResumeApi} from '../api';
// import Notification from '../component/Notification'

/**
 * getMyResume
 */
export const getMyResume = async () => {
  const marked = await import(/*webpackChunkName:'Marked.lib'*/ '../lib/markdown/marked').catch(
    err => {
      err.interceptor && Notification.err('啊偶~获取marked渲染文件失败~');
    },
  );

  const resume = await MyResumeApi.getMyResume().catch(err => {
    err.interceptor && Notification.err(`啊偶~获取个人Resume失败~:${err.msg}`);
  });

  resume.data.resume = (marked.__esModule ? marked.default : marked)(
    resume.data.resume,
  );

  return resume;
};
