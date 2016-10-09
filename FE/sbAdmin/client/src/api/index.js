'use strict'

import { commonResource, articleResource } from './resource'


export const articleApi = {
  getArticleList: (page, limit, search)=>articleResource('get', `/articleList?page=${page}&limit=${limit}`),
  getArticleDetail: (articleId)=>articleResource('get', `/article?articleId=${articleId}`),
  updateArticleDetail: (articleId, articleDetail)=>articleResource('put', `/article/${articleId}`, articleDetail)
}