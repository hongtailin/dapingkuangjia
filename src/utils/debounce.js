/**
 * update: 洪泰林
 * time: 2023-7-19
 * 
 * 防抖
 * @param {*} func 需要防抖的方法
 * @param {*} delay 防抖时间
 * @param {*} immediate 是否需要立即执行
 * @returns
 */

export function debounce(func, delay, immediate = false) {

    let timer = null
    return function (...args) {
        let that = this
        // 使用...args 可以传多个参数
        if (timer) clearTimeout(timer)  
        
        if (immediate) {
            let callNow = !timer
        
            timer = setTimeout(() => {
                func.apply(that, args)
                timer = null
            }, delay)

            if (callNow) func.apply(that, args)
        } else {
            timer = setTimeout(() => {
                func.apply(that, args)
            }, delay)
        }
        
    }
    
}