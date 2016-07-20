import {ArticleApi} from '../api'
import {RouterArticle,Spinner,Header} from '../actions/typs'
import Notification from '../component/Notification'

/**
 * 获取文章详情
 * @param articleId
 */

export const getArticleDetail = (articleId)=>(dispatch, getState)=> {
    dispatch({type: Spinner.SHOW_SPINNER});
    ArticleApi.getArticleDetail(articleId)
        .then(response=>({json: response.data, status: response.statusText}))
        .then(({json,status})=> {
            if (status !== 'OK') {
                Notification.err("啊偶~获取文章详情失败");
            }
            dispatch({type: Spinner.HIDE_SPINNER});
            return dispatch({
                type: RouterArticle.GET_ARTICLE_DETAIL,
                articleDetail: json.data
            })
        }).catch(err=> {
        console.error(err);
    })
};

/**
 * 设置 article detail 完全加载完成
 */
export const setArticleReady = ()=> (dispatch)=> dispatch({
    type: RouterArticle.SET_ARTICLE_DETAIL_READY
});
/**
 * 重置 article ready state
 * @returns {Function}
 */
export const resetArticleReady = ()=> (dispatch)=> dispatch({
    type: RouterArticle.RESET_ARTICLE_DETAIL_READY
});

/**
 * 设置header scroll limit
 * @param value
 */
export const setHeaderScrollLimit = (value)=> (dispatch)=>
    dispatch({
        type: Header.SET_HEADER_SCROLL_LIMIT,
        value: value
    });


/**
 * 设置showHeader
 */
export const showHeader = ()=> (dispatch)=>
    dispatch({
        type: Header.SHOW_HEADER
    });

/**
 * 设置hideHeader
 */
export const hideHeader = ()=>(dispatch)=>
    dispatch({
        type: Header.HIDE_HEADER
    });

/**
 * 设置 articleSideBar
 */

export const toggleArticleSideBar = ()=> (dispatch)=> dispatch({
    type: RouterArticle.TOGGLE_ARTICLE_SIDE_BAR
});

/**
 * 清除当前博客详情的state
 */
export const clearArticleDetailState = ()=>(dispatch)=> dispatch({
    type: RouterArticle.CLEAR_ARTICLE_DETAIL_STATE
});