'use strict'
import { Discuss } from '../actions/typs'
import { ReplyApi, ToolsApi } from '../api'
import Notification from '../component/Notification'

export const getArticleReply = (articleId, page = 1, limit = 30)=>(dispatch)=> {
  return ReplyApi.getArticleReply(articleId, page, limit).then(replyList=> {
    dispatch({
      type: Discuss.GET_ARTICLE_REPLY,
      data: replyList
    })
    return replyList
  }).catch(err=> {
    err.interceptor && Notification.err(`啊偶~获取文章评论失败~:${err.msg}`)
  })
}

export const addArticleReply = (data)=>(dispatch)=> {
  return ReplyApi.addArticleReply(data).catch(err=> {
    err.interceptor && Notification.err(`啊偶~添加文章评论失败~:${err.msg}`)
  })
}

export const getVerifyCode = ()=>(dispatch)=> {
  return ToolsApi.getVerifyCode().catch(err=> {
    err.interceptor && Notification.err(`啊偶~获取验证码失败~:${err.msg}`)
  })
}
