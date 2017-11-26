//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
'use strict'

'use strict'
import { ArticleManagement } from '../action/action.type'
import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'

/**
 * initialState
 */
const initialState = fromJS({
  Article: {}
})

/**
 * export reducer
 */
export default createReducer(initialState, {
  [ArticleManagement.GET_ARTICLE_LIST](state, action) {
    return state.merge({
      Article: action.data
    })
  }
})