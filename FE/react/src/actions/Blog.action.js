import {BlogApi} from '../api'
import {RouterBlog,Spinner,Header} from '../actions/typs'
import Notification from '../component/Notification'
//获取文章列表
export const getBlogList = (page, size, tag)=> {
    return (dispatch, getState)=> {
        dispatch({type: Spinner.SHOW_SPINNER});
        BlogApi.getBlogList(page, size, tag)
            .then(response=>({json: response.data, status: response.statusText}))
            .then(({json,status})=> {
                if (status !== 'OK') {
                    Notification.err("啊偶~获取文章列表失败");
                }
                dispatch({type: Spinner.HIDE_SPINNER});
                return dispatch({
                    type: RouterBlog.GET_ARTICLE_LIST,
                    articleList: json.data
                })
            }).catch(err=> {
            console.error(err);
        });
    }
};

//显示header
export const showHeader = ()=> {
    return (dispath)=> {
        dispath({
            type: Header.SHOW_HEADER
        })
    }
};