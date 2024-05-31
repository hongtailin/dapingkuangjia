import { throwErr } from '@/utils/throwError' //utils 捕捉服务端http状态码的方法
// 二次封装 axios  (拦截器)

import axios from 'axios';
import Cookies from 'js-cookie';
import router from '@/router/index'

// 借助 qs 将对象进行序列化
// import qs from 'qs'

// baseURL 不可写错
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 50 * 1000
})



service.interceptors.request.use((config) => {
    /* 发送请求时, 需要做的事 */
    // 设置请求头信息, 例如 token
    const token = Cookies.get('Admin-Token')
    if (token && config.headers.isToken !== false) {
        config.headers['authorization'] = token
    } 

    // 当请求类型为 get 时, 则将 参数拼接
    if(config.method === 'get') {
        config.params = config.data
    }


    // 当请求类型为 post 时, 按后端需要, 转成需要的类型 (这里转为 formData 格式)
    if(config.method === 'post' || config.method === 'put') {
    // 具体传参类型, 根据后端接口要求进行设置
    // 参数类型为 formData 格式时, 设置 Content-Type 为 application/x-www-form-urlencoded
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        config.data = JSON.stringify(config.data)
    }


    return config;
}, 
(error) => {

    return Promise.reject(error);
})



service.interceptors.response.use((response) => {
    // 接口响应时需要做的事
    let res = response.data
    if (res.code === 200) {
        return Promise.resolve(res)
    } else if (res.code === 401) {
    // token过期
        Cookies.remove('Admin-Token')
        router.push({
            path: '/login'
        })
    } else {
        return Promise.reject(res)
    }

},
(error) => {
    if (error && error.response) {
        let res = {}
        res.code = error.response.status
        res.msg = throwErr(error.response.status, error.response) //throwErr 捕捉服务端的http状态码 定义在utils工具类的方法
        return Promise.reject(res)
    }
    return Promise.reject(error)
})



export default service