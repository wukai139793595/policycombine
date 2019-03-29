import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import {API_URL} from './index.js'

// 创建axios实例
axios.defaults.withCredentials = true;
const service = axios.create({
  baseURL: API_URL, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.errcode === 255) {
            if (window !== window.parent) {
                window.parent.location.href = API_URL + 'www.yunbisai.com/login';
            } else {
                window.location.href = API_URL + 'www.yunbisai.com/login';
            }
        }
        if (res.errcode !==0 || res.error !== 0) {
            Message({
                message: res.message,
                type: 'error',
                duration: 3e3
            })
            return Promise.reject('error')
        } else {
            return response.data

        }
    },
    error => {
        Message({
            message: error.message,
            type: 'error',
            duration: 3e3
        })
        return Promise.reject(error);
    }
)

export default service

