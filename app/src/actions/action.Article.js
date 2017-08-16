'use strict';

import {ArticleApi} from '../api';
// import Notification from '../component/Notification'
// import Spinner from '../component/Spinner'
import {RouterArticle, Header} from '../actions/typs';

/**
 * 获取文章详情
 * @param articleId
 */
export const getArticleDetail = articleId => async (dispatch, getState) => {
  Spinner.show();

  const marked = await import(/*webpackChunkName:'Marked.lib'*/ '../lib/markdown/marked').catch(
    err => {
      err.interceptor && Notification.err('啊偶~获取marked渲染文件失败~');
    },
  );

  const articleDetail = await ArticleApi.getArticleDetail(
    articleId,
  ).catch(err => {
    err.interceptor && Notification.err('啊偶~读取文章详情失败~');
  });

  Spinner.remove();

  articleDetail.data.content = (marked.__esModule ? marked.default : marked)(
    articleDetail.data.content,
  );

  return dispatch({
    type: RouterArticle.GET_ARTICLE_DETAIL,
    articleDetail: articleDetail.data,
  });
};

/**
 * 清除当前博客详情的state
 */
export const clearArticleDetailState = () => dispatch =>
  dispatch({
    type: RouterArticle.CLEAR_ARTICLE_DETAIL_STATE,
  });
