'use strict'
import { Me } from '../actions/typs'
import { MyResumeApi } from '../api'

import Notification from '../component/Notification'

export const getMyResume = ()=>(dispatch)=> {
  MyResumeApi.getMyResume().then(data=> {
    dispatch({
      type: Me.GET_MY_RESUME,
      data: data
    })
    return data
  }).catch(err=> {
    err.interceptor && Notification.err(`啊偶~获取个人Resume失败~:${err.msg}`)
  })
}
