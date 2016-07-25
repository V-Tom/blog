import axios from 'axios'
import {API_ROOT,API_VERSION} from '../config'

axios.defaults.baseURL = API_ROOT;
axios.defaults.withCredentials = false;

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});


export const BlogListResource = (method, type,data) => {
    return axios[method](`${API_VERSION}/blog/list/${type}`,data)
};

export const ArticleResource = (method, type,data)=> {
    return axios[method](`${API_VERSION}/blog/article/${type}`,data)
};

export const ReplyResource = (method, type,data)=> {
    return axios[method](`${API_VERSION}/blog/reply/${type}`,data)
};

export const ToolsResource = (method, type,data)=> {
    return axios[method](`${API_VERSION}/tools/${type}`,data)
};