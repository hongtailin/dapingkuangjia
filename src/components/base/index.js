// 动态注册全局组件
// import Vue from "vue";

export default {
    install(Vue) {
        // 创建出一个context，来自`./`父目录 不需要搜索子目录，以`.vue`结尾
        // 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
        let allComponent = require.context('./', false, /\.vue$/)
        allComponent.keys().forEach(item => {
            // const component = allComponent(item).default
            // console.log(component.name) // undefined ??
            Vue.component(item.replace(/\.\//, '').replace(/\.vue$/, ''), allComponent(item).default)
        })
    }
}