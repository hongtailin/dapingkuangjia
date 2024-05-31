import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import monitor from './monitor'

export default new Vuex.Store({
    state: {
        isFullPage: false
    },
    getters: {
    },
    mutations: {
        SET_IS_FULL_PAGE (state, value) {
            state.isFullPage = value
        }
    },
    actions: {
        setIsFullPage ({ commit }) {
            const isFullPage = document.body.clientWidth >= 3840 // 屏幕宽度
            // window.screen.width  分辨率
            // document.body.clientWidth 屏幕宽度

            commit('SET_IS_FULL_PAGE', isFullPage)
        }
    },
    modules: {
        monitor
    }
})
