import axios from 'axios'
import { restfulAPI } from '../config'
const { API_ROOT, API_VERSION, DO_NOT_INTERCEPTOR_PORT } = restfulAPI
axios.defaults.baseURL = API_ROOT;
axios.defaults.withCredentials = false;
axios.defaults.headers.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1N2E4YmM1ZjZhZGFjZDY2ZDkxNjhmZWUiLCJpYXQiOjE0NzE3NzYzMTAsImV4cCI6MTQ3MTg2MjcxMH0.I8UnVOS6AUY_EOjraRNi8izuI8sfjP5FFBd3xYhvAdQ'
// Add a request interceptor
axios.interceptors.request.use((config) => {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use((response)=> {

  //The request URL in some case do not interceptor
  if (DO_NOT_INTERCEPTOR_PORT.indexOf(response.request.responseURL) >= 0) {
    return response.data
  }

  //response status must be 200
  //response statusText must be 'OK'

  let interceptors = response.data

  if (interceptors.status === 0) {
    return interceptors.result
  }

  return Promise.reject({ status: interceptors.status, msg: interceptors.msg, interceptor: true })
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});


export const BlogListResource = (method, type, data) => {
  return axios[method](`${API_VERSION}/blog/articlelist${type || ''}`, data)
};

export const ArticleResource = (method, type, data)=> {
  return axios[method](`${API_VERSION}/blog/article${type || ''}`, data)
};

export const ReplyResource = (method, type, data)=> {
  return axios[method](`${API_VERSION}/blog/reply${type || ''}`, data)
};

export const ToolsResource = (method, type, data)=> {
  return axios[method](`${API_VERSION}/tools${type || ''}`, data)
};