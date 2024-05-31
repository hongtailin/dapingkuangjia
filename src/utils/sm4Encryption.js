//1、安装依赖  npm install --save sm-crypto
//2、在main.js里面注册全局方法 Vue.prototype.$sm4Encryption = sm4Encryption
//3、代码里直接调用 this.$sm4Encryption.toSm4('你的值')
export default {
    toSm4(value){
        const sm4 = require('sm-crypto').sm4
        const msg = value // 可以为 utf8 串或字节数组
        const key = '57494e44414b415f534d415254313059' // 可以为 16 进制串或字节数组，要求为 128 比特
        return sm4.encrypt(msg, key, {mode: 'cbc', iv: '30313233343536373839616263646566'}) // 加密，cbc 模式
    }
}
