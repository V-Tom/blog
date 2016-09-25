import fetch from './fetch'
import { restfulAPI } from '../config'
const { API_ROOT, API_VERSION, DO_NOT_INTERCEPTOR_PORT } = restfulAPI
fetch.defaults.baseURL = API_ROOT;
fetch.defaults.withCredentials = false;
fetch.defaults.headers.token = ''
// Add a request interceptor

fetch.interceptors.request.use((config) => {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
fetch.interceptors.response.use(({ response, data })=> {

  //The request URL in some case do not interceptor
  if (DO_NOT_INTERCEPTOR_PORT.indexOf(response.url) >= 0) {
    return response.json()
  }

  //response status must be 200
  //response statusText must be 'OK'


  if (data.status === 0) {
    return data.result
  }
  return Promise.reject({ status: data.status, msg: data.msg, interceptor: true })
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});


export const BlogListResource = (method, type, data) => {
  return fetch.http(method, `${API_VERSION}/blog/articlelist${type || ''}`, data)
};

export const ArticleResource = (method, type, data)=> {
  return fetch.http(method, `${API_VERSION}/blog/article${type || ''}`, data)
};

export const ReplyResource = (method, type, data)=> {
  return fetch.http(method, `${API_VERSION}/blog/reply${type || ''}`, data)
};

export const ToolsResource = (method, type, data)=> {
  return fetch.http(method, `${API_VERSION}/tools${type || ''}`, data)
};

export const MyResource = (method, type, data)=> {
  return fetch.http(method, `${API_VERSION}/my${type || ''}`, data)
};