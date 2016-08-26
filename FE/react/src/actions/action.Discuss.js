'use strict'
import { Discuss } from '../actions/typs'
import { ReplyApi, ToolsApi } from '../api'
import Notification from '../component/Notification'

export const getArticleReply = (articleId, page = 1, limit = 10)=>(dispatch)=> {
  return ReplyApi.getArticleReply(articleId, page, limit).then(replyList=> {
    dispatch({
      type: Discuss.GET_ARTICLE_REPLY,
      data: replyList
    })
    return replyList
  }).catch(e=> {
    err.interceptor && Notification.err(`啊偶~获取文章评论失败~:${e.msg}`)
  })
}

export const addArticleReply = (data)=>(dispatch)=> {
  return ReplyApi.addArticleReply(data).catch(e=> {
    err.interceptor && Notification.err(`啊偶~添加文章评论失败~:${e.msg}`)
  })
}

export const getVerifyCode = ()=>(dispatch)=> {
  return ToolsApi.getVerifyCode().then(verifyCode=> {
    dispatch({
      type: Discuss.GET_REPLY_VERIFY_CODE,
      data: verifyCode
    })
    return verifyCode
  }).catch(e=> {
    err.interceptor && Notification.err(`啊偶~获取验证码失败~:${e.msg}`)
  })
}
