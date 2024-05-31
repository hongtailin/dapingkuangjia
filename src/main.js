import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// element插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
Vue.use(ElementUI);

// 全局样式
import '@/style/index.scss'

// echarts
import * as echarts from 'echarts';
import "echarts-gl"
Vue.prototype.$echarts = echarts

//cookies
import Cookies from 'js-cookie'
Vue.prototype.$cookies = Cookies


// 注册全局组件
import components from '@/components/base/index.js'
Vue.use(components)

// 注册全局指令
import directives from './directives'
Vue.use(directives)

//全局filter
import filters from './utils/filter'
Object.keys(filters).forEach(k => {
    Vue.filter(k, filters[k])
})

// animate动画插件
import 'animate.css';

// sm4加密
import sm4Encryption from '@/utils/sm4Encryption';
Vue.prototype.$sm4Encryption = sm4Encryption

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
