import request from './axios.js'

// 登录方法
//export function login(username, password, code, uuid) {
//    const data = {
//        username,
//        password,
//        code,
//        uuid
//    }
//    return request({
//        url: '/login',
//        method: 'post',
//        data: data,
//        headers: {
//            isToken: false
//        }
//    })
//}

export function login() {
    return request({
        url: '/loginSys',
        method: 'post',
        data: {
            username: 'zhongkang',
            password: 'zhongkang@123'
        },
        headers: {
            isToken: false
        }
    })
}

// 注册方法
export function register(data) {
    return request({
        url: '/register',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/getInfo',
        method: 'get'
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: '/captchaImage',
        headers: {
            isToken: false
        },
        method: 'get',
        timeout: 20000
    })
}