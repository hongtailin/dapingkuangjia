import clickOutside from './clickOutside'

const directives = {
    clickOutside
}
export default {
    install(Vue) {
        Object.keys(directives).forEach(key => {
            Vue.directive(key, directives[key])
        })
    }
}