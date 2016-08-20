import { BlogListResource, ArticleResource, ToolsResource, ReplyResource } from './resource'


const getBlogListLimit = 10;

export const BlogApi = {
  getBlogList: (page, limit, tagName)=> {
    if (tagName) {
      return BlogListResource('get', `?limit=${limit}&page=${page}&tag=${tagName}`);
    } else {
      return BlogListResource('get', `?limit=${limit}&page=${page}`);
    }
  },
  getBlogListLimit: getBlogListLimit
};

export const ArticleApi = {
  getArticleDetail: (articleId)=> ArticleResource('get', `?articleId=${articleId}`)
};

export const ReplyApi = {
  getReply: (articleId, page, limit)=>ReplyResource("get", `?articleId=${articleId}&page=${page}&limit=${limit}`),
  addReply: data=>ReplyResource("post", data)
};

export const ToolsApi = {
  getVerifyCode: ()=>ToolsResource('get', '/libs/verifyCode')
};