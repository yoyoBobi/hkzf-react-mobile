/**
 * axios 请求封装
 */
import { Toast, Dialog } from 'antd-mobile'
import axios from 'axios'
import Storage from '@/utils/storage'
import qs from "qs";
import { history } from '@/utils/history';
import { useNavigate } from 'react-router-dom';


export const baseURL = 'http://localhost:8080'



// 创建 axios 实例
const $http = axios.create({
    baseURL: baseURL,
    timeOut: 10000,
});

//请求拦截
$http.interceptors.request.use(
    (config) => {
        // 加载动画
        if (config.loading) Toast.show({ icon: 'loading', content: '加载中…', maskClickable: false, duration: 0 })
        // console.log("请求配置", config);
        // 业务逻辑
        // 设置token，用户相关请求携带 token 信息
        if (Storage.get("token")) config.headers["Authorization"] = Storage.get("token")

        // 表序列化,表单数据发送服务器需要序列化
        // config.data = qs.stringify(config.data);
        // 设置请求头
        if (config.contentType === 'form') config.headers["content-type"] = "application/x-www-form/urlencoded";
        else if (config.contentType === 'file') config.headers["content-type"] = "multipart/form-data";
        else config.headers["content-type"] = "application/json";

        return config
    },
    (error) => {
        // 错误抛到业务代码
        Toast.show({ content: '服务器异常，请联系管理员！', position: 'top' })
        return Promise.resolve(error)
    }
)

// 响应拦截
$http.interceptors.response.use(
    (response) => {
        // console.log('response：', response.data)
        const status = response.data.status
        let message = "";
        if (status < 200 || status >= 300) {
            Toast.show({ content: response.data.description, position: 'top' })
            // 处理http错误，抛到业务代码
            message = showStatus(status)

            //拦截异常（通知）
            // Notification({ title: '提示', message: message, type: 'error' })
            if (response.data.description == 'token异常或者过期' && response.data.status === 400) {
                Storage.clearUserInfo()
                //路由跳转
                Dialog.confirm({
                    content: '登录已失效，是否重新去登录？',
                    onConfirm: async () => {
                        // 路由跳转
                        history.push('/login')
                        // history.replace({ pathname: "/login", state: {} });
                        history.go(0)
                    },
                })
            }
        }
        // 关闭加载动画
        setTimeout(() => Toast.clear(), 500)
        //业务逻辑部分 ,比如判断token值是否过期
        // let data = response.data;
        if (status === 200) return response
    }, (error) => {
        // 错误抛到业务代码
        Toast.show({ content: '请求超时或服务器异常，请检查网络或联系管理员！', position: 'top' })
        return Promise.resolve(error)
    }
)

const showStatus = (status) => {
    let message = ''
    switch (status) {
        case 302:
            message = "接口重定向了(302)";
            break;
        case 400:
            message = '请求错误(400)，请检查网络或联系管理员！'
            break
        case 401:
            message = '未授权，请重新登录(401)'
            break
        case 403:
            message = '拒绝访问(403)'
            break
        case 404:
            message = '请求出错(404)'
            break
        case 408:
            message = '请求超时(408)'
            break
        case 500:
            message = '服务器异常，请检查网络或联系管理员！(500)'
            break
        case 501:
            message = '服务未实现(501)'
            break
        case 502:
            message = '网络错误(502)'
            break
        case 503:
            message = '服务不可用(503)'
            break
        case 504:
            message = '网络超时(504)'
            break
        case 505:
            message = 'HTTP版本不受支持(505)'
            break
        default:
            message = `连接出错(${status})!`
    }
    return `${message}，请检查网络或联系管理员！`
}

export default $http;
