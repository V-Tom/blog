import { BlogApi } from '../api'
import { RouterBlog, Spinner, Header } from '../actions/typs'
import Notification from '../component/Notification'

/**
 * 获取文章列表
 * @param page
 * @param size
 * @param tag
 * @returns {function()}
 */
export const getBlogList = (page, size, tag)=> (dispatch)=> {
  dispatch({ type: Spinner.SHOW_SPINNER })
  BlogApi.getBlogList(page, size, tag)
    .then(blogList=> {
      dispatch({ type: Spinner.HIDE_SPINNER })
      dispatch({
        type: RouterBlog.GET_ARTICLE_LIST,
        articleList: blogList
      })
      return blogList
    }).catch(err=> {
    err.interceptor && Notification.err("啊偶~读取文章列表失败~")
  })
}
/**
 * 清除 blog state
 */
export const clearBlogState = ()=>(dispatch)=> {
  dispatch({
    type: RouterBlog.CLEAR_BLOG_LIST_STATE
  })
  return Promise.resolve()
}

/**
 * 显示header
 * @returns {function()}
 */
export const showHeader = ()=> (dispatch)=> {
  dispatch({
    type: Header.SHOW_HEADER
  })
  return Promise.resolve()
}