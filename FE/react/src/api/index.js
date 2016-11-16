import { BlogListResource, ArticleResource, ToolsResource, ReplyResource, MyResource } from './resource'


const getBlogListLimit = 10;

export const BlogApi = {
  getBlogList: (page, limit, tagName)=> {
    let uri = `?limit=${limit}&page=${page}`
    if (tagName) {
      uri += `&tag=${tagName}`
    }
    return BlogListResource('get', uri);
  },
  getBlogListLimit: getBlogListLimit
};

export const ArticleApi = {
  getArticleDetail: (articleId)=> ArticleResource('get', `/${articleId}`)
};

// export const ReplyApi = {
//   getArticleReply: (articleId, page, limit)=>ReplyResource("get", `?articleId=${articleId}&page=${page}&limit=${limit}`),
//   addArticleReply: data=>ReplyResource("post", null, data)
// };

export const ToolsApi = {
  getVerifyCode: ()=>ToolsResource('get', '/libs/verifyCode')
};

export const MyResumeApi = {
  getMyResume: ()=>MyResource('get', '/resume')
}