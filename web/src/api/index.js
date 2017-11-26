'use strict'

import { commonResource, articleResource, authResource, toolsResource } from './resource'


export const articleApi = {
  getArticleList: (page, limit, search)=>articleResource('get', `/articleList?page=${page}&limit=${limit}`),
  getArticleDetail: (articleId)=>articleResource('get', `/article/${articleId}`),
  updateArticleDetail: (articleId, articleDetail)=>articleResource('put', `/article/${articleId}`, articleDetail)
}

export const authApi = {
  getAdminToken: ()=>authResource('post', '/user/getAdminToken?secret=NOMAND')
}

export const toolsApi = {
  getCdnUploadToken: ()=>toolsResource('get', '/cdn/upload')
}

export const commonApi = (method, type, data)=>commonResource(method, type, data)