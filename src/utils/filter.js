function compSrc (data)  {
    return data ? process.env.VUE_APP_TARGET + data : ''
}

function filterName (data) {
    // 姓名加密， 如张某某--张*某
    return `${data[0]}*${data[data.length - 1]}`
}

// 数字 千位加，
function formatNumber (number) {    
    let valTemp = ''
    if (number == 0) return 0
    
    if(number){
        const val = +number
        if(!isNaN(val)){
            valTemp = number.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        }else {
            valTemp = number
        }
    }
    
    return valTemp
}

export default {
    compSrc,
    filterName,
    formatNumber
}