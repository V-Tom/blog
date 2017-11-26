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
import { restfulAPI } from '../config'
const { API_VERSION, TOKEN } = restfulAPI
import AxiosAlpha from './axios.alpha'

export const commonResource = (method, type, data) =>AxiosAlpha[method](`${API_VERSION}${type || ''}`, data)
export const articleResource = (method, type, data) =>AxiosAlpha[method](`${API_VERSION}/blog${type || ''}`, data)
export const authResource = (method, type, data) =>AxiosAlpha[method](`${API_VERSION}/auth${type || ''}`, data)
export const toolsResource = (method, type, data) =>AxiosAlpha[method](`${API_VERSION}/tools${type || ''}`, data)