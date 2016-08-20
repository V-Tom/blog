import { BlogApi } from '../api'
import { RouterBlog, Spinner, Header } from '../actions/typs'
import Notification from '../component/Notification'
//获取文章列表
export const getBlogList = (page, size, tag)=> {
  return (dispatch, getState)=> {
    dispatch({ type: Spinner.SHOW_SPINNER })
    BlogApi.getBlogList(page, size, tag)
      .then(blogList=> {
        dispatch({ type: Spinner.HIDE_SPINNER })
        return dispatch({
          type: RouterBlog.GET_ARTICLE_LIST,
          articleList: blogList.data
        })
      }).catch(err=> {
      err.interceptor && Notification.err("啊偶~读取文章列表失败~")
    })
  }
}

//显示header
export const showHeader = ()=> {
  return (dispath)=> {
    dispath({
      type: Header.SHOW_HEADER
    })
  }
}