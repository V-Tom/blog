'use strict';
import fetch from './fetch';
import {restfulAPI} from '../config';
const {API_ROOT, API_VERSION, DO_NOT_INTERCEPTOR_PORT} = restfulAPI;

fetch.defaults.baseURL = API_ROOT;
fetch.defaults.withCredentials = false;
fetch.defaults.headers.token = '';

fetch.interceptors.request.use(
  config => {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

fetch.interceptors.response.use(
  ({response, data}) => {
    if (DO_NOT_INTERCEPTOR_PORT.indexOf(response.url) >= 0) {
      return response.json();
    }

    //response status must be 200
    //response statusText must be 'OK'

    if (data.status === 200) {
      return data.result;
    }
    return Promise.reject({
      status: data.status,
      msg: data.msg,
      interceptor: true,
    });
  },
  function(error) {
    return Promise.reject(error);
  },
);

export const BlogListResource = (method, type, data) =>
  fetch.request(method, `${API_VERSION}/blog/list${type || ''}`, data);

export const ArticleResource = (method, type, data) =>
  fetch.request(method, `${API_VERSION}/blog/article${type || ''}`, data);

export const ReplyResource = (method, type, data) =>
  fetch.request(method, `${API_VERSION}/blog/reply${type || ''}`, data);

export const ToolsResource = (method, type, data) =>
  fetch.request(method, `${API_VERSION}/tools${type || ''}`, data);

export const MyResource = (method, type, data) =>
  fetch.request(method, `${API_VERSION}/my${type || ''}`, data);
