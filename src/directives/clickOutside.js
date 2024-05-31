import Vue from 'vue'

/**
 * owner: 洪泰林
 * update: 洪泰林
 * time: 2023-12-12
 * 
 * 点击其他空白处, 关闭DOM
 * 用法:
 * v-click-outside="关闭弹框的方法"
 */

Vue.directive('click-outside', {
    bind(el, binding, vnode) {
        // 点击页面任意地方触发回调函数
        const handleClick = (e) => {
            if (!el.contains(e.target)) {
                // 点击弹窗外部，执行绑定的关闭函数
                binding.value();
            }
        };

        // 添加事件监听器
        document.addEventListener('click', handleClick);

        // 在元素销毁时移除事件监听器
        el._clickOutsideHandler = handleClick;
    },
    unbind(el) {
        // 移除事件监听器
        document.removeEventListener('click', el._clickOutsideHandler);
        delete el._clickOutsideHandler;
    },
});