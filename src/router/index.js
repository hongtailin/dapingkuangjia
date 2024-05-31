import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import homeView from '../views/homeView.vue'
import login from '@/views/login.vue'

Vue.use(VueRouter)

const isFullPage = document.body.clientWidth >= 3840 // 屏幕宽度
// window.screen.width  分辨率
// document.body.clientWidth 屏幕宽度

const routes = [
    {
        path: '/login',
        name: 'login',
        component: login,
    },
    {
        path: '/',
        name: 'homePage',
        component: homeView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        const token = Cookies.get('Admin-Token')
        if (token) {
            next();
        }
        else {
            next({
                path: '/login'
            })
        }
    }
    else {
        next();
    }
})


export default router
