/*
* 能发ajax请求的函数模块
* 封装axios
* 1将post请求参数转换urlencoded（默认json）==》请求拦截器
* 2请求成功的结果不是response，而是response。data  ==》响应拦截器
* 3统一处理请求错误
*
* */


import axios from 'axios'
import qs from 'qs'
import {message} from "antd";

// axios.defaults.baseURL= 'http://localhost:5000';
axios.interceptors.request.use((config) => {
    let data = config.data;
    if (data && data instanceof Object) {
        config.data = qs.stringify(data);
    }
    return config
});
axios.interceptors.response.use(
    response => {
        return response.data
    }, error => {
        message.error("请求出错" + error.message);
        return new Promise(() => {
        })//终端promise链
    }
);




export default axios