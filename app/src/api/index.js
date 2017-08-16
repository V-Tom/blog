'use strict';
import {
  BlogListResource,
  ArticleResource,
  ToolsResource,
  ReplyResource,
  MyResource,
} from './resource';

/**
 * BlogApi
 */
export const BlogApi = {
  getBlogList: (page, limit, tagName) => {
    let uri = `?limit=${limit}&page=${page}`;
    if (tagName) {
      uri += `&tag=${tagName}`;
    }
    return BlogListResource('get', uri);
  },
};

/**
 * ArticleApi
 */
export const ArticleApi = {
  getArticleDetail: articleId => ArticleResource('get', `/${articleId}`),
};

/**
 * ReplyApi
 */
export const ReplyApi = {
  getArticleReply: (articleId, page, limit) =>
    ReplyResource('get', `?articleId=${articleId}&page=${page}&limit=${limit}`),
  addArticleReply: data => ReplyResource('post', null, data),
};

/**
 * ToolsApi
 */
export const ToolsApi = {
  getVerifyCode: () => ToolsResource('get', '/lib/verifyCode'),
};

/**
 * MyResumeApi
 */
export const MyResumeApi = {
  getMyResume: () => MyResource('get', '/resume'),
};
