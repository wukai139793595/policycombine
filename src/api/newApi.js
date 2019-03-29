import request from '@/util/request.js'
import Qs from 'qs'

// errcode = 255 时，自动跳转到登录页面
function toLogin() {
    if (window !== window.parent) {
        window.parent.location.href = API_URL + 'www.yunbisai.com/login';
    } else {
        window.location.href = API_URL + 'm.yunbisai.com/login';
    }
}

if (location.host === '192.168.2.81:3001') {
    const PROCOTOL_HEAD = 'http://192.168.2.81:3001'
    var post = function (url, params) {
        let paramsStr = '?';
        let fullUrl = '';
        for (let prop in params) {
            paramsStr += `${prop}=${params[prop]}&`;
        }
        fullUrl = PROCOTOL_HEAD + url + paramsStr;
        console.log(fullUrl)
        return new Promise((resolve, reject) => {
            request.get(fullUrl)
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
    var post = function (url, params) {
        console.log(API_URL)
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: 'open.yunbisai.com'+url,
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

    var postApi = function (url, params) {
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: 'api.yunbisai.com'+url,
                data: Qs.stringify(params),
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                timeout: 3e3,
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

    var getApi = function (url, params) {
        return new Promise((resolve, reject) => {
            request.get('api.yunbisai.com'+url, {
                params
            })
            .then(res => {
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


// 获取赛事小组
export const postGroup = (params) => {return post('/index/index/group', params)};
// 获取赛事小组未保险人员
export const postNoPolicyPerson = (params) => {return post('/index/index/noPolicy', params)};
// 获取保险种类
export const postInsuranceClassify = (params) => {return post('/index/index/getRisk',params)};
// 钱包余额
export const postWallet = (params) => {return post('/index/index/wellet',params)}
// 创建订单
export const postCreateOrder = (params) => {return post('/index/index/createOrder', params)}
// 余额支付
export const postPay = (params) => {return post('/index/index/pay', params)}
// 查询小组是否有待支付的订单
export const postCheckOrder = (params) => {return post('/index/index/checkOrder', params)};
// 取消订单
export const postCancelOrder = (params) => {return post('/index/index/cancelOrder', params)}
// 建行支付请求 PC端
export const postCcbPay = (params) => {return postApi('/pay/ccb', params)}
// 建行支付请求 移动端 支付宝
export const postCcbPayAli = (params) => {return postApi('/pay/ali', params)}
// 建行支付请求 移动端 微信
export const postCcbPayWx = (params) => {return postApi('/pay/wx', params)}
//付款订单轮询 
export const postPolling = (params) => {return getApi('/pollingPay/Index/index', params)}

//获取保单信息
export const postQueryPolicy = (params) => {return post('/index/index/getPolicy',params)};
//退保
export const postPolicyCancel = (params) => {return post('/index/index/policyCancell', params)}
//查询保单详情
export const postPolicyDetail = (params) => {return post('/index/Policy/policyDetail', params)}
