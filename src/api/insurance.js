import axios from 'axios'
import Qs from 'qs'
import {API_URL} from '@/util/index.js'
axios.defaults.withCredentials = true;

function toLogin() {
    if (window !== window.parent) {
        window.parent.location.href = API_URL + 'www.yunbisai.com/login';
    } else {
        window.location.href = API_URL + 'm.yunbisai.com/login';
    }
}
if (location.host === '192.168.2.81:3000' ) {  
    // 测试环境的请求地址
    const PROCOTOL_HEAD = 'http://192.168.2.81:3000'
    var post = function (url, params) {
        let paramsStr = '?';
        let fullUrl = '';
        for (let prop in params) {
            paramsStr += `${prop}=${params[prop]}&`;
        }
        fullUrl = PROCOTOL_HEAD + url + paramsStr;
        console.log(fullUrl)
        return new Promise((resolve, reject) => {
            axios.get(fullUrl)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }
    var postApi = post;
} else {
    //以http://dev-open开头的请求
    var post = function (url, params) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: API_URL+'open.yunbisai.com'+url,
                data: Qs.stringify(params),
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                timeout: 5e3,
                withCredentials: true
            }).then(res => {
                if (res.data && (res.data.errcode === 255)) {
                    toLogin();
                }
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }   
//以http://dev-api开头的请求
    var postApi = function (url, params) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: API_URL+'api.yunbisai.com'+url,
                data: Qs.stringify(params),
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                withCredentials: true
            }).then(res => {
                if (res.data && (res.data.errcode === 255)) {
                    toLogin();
                }
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }    
}
//获取保单信息
export const postQueryPolicy = (params) => {return post('/index/index/getPolicy',params)};
//退保
export const postPolicyCancel = (params) => {return post('/index/index/policyCancell', params)}
//查询保单详情
export const postPolicyDetail = (params) => {return post('/index/Policy/policyDetail', params)}

