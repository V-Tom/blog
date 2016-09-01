import { ArticleApi } from '../api'
import { RouterArticle, Header } from '../actions/typs'
import Notification from '../component/Notification'
import Spinner from '../component/Spinner'
/**
 * 获取文章详情
 * @param articleId
 */

export const getArticleDetail = (articleId)=>(dispatch, getState)=> {
  Spinner.show()
  ArticleApi.getArticleDetail(articleId)
    .then(articleDetail=> {
      Spinner.remove()
      return dispatch({
        type: RouterArticle.GET_ARTICLE_DETAIL,
        articleDetail: articleDetail.data
      })
    }).catch(err=> {
    err.interceptor && Notification.err("啊偶~读取文章详情失败~")
  })
}
/**
 * 设置header scroll limit
 * @param value
 */
export const setHeaderScrollLimit = (value)=> (dispatch)=>
  dispatch({
    type: Header.SET_HEADER_SCROLL_LIMIT,
    value: value
  })


/**
 * 设置showHeader
 */
export const showHeader = ()=> (dispatch)=>
  dispatch({
    type: Header.SHOW_HEADER
  })

/**
 * 设置hideHeader
 */
export const hideHeader = ()=>(dispatch)=>
  dispatch({
    type: Header.HIDE_HEADER
  })
/**
 * 清除当前博客详情的state
 */
export const clearArticleDetailState = ()=>(dispatch)=> dispatch({
  type: RouterArticle.CLEAR_ARTICLE_DETAIL_STATE
})