import request from './axios.js'

// 获取养老机构信息
export function getInstitutionInfo(data) {
    return request({
        url: '/api/nursingFacility',
        method: 'get',
        data: data
    })
}

// 获取老年人信息
export function getAgedInfo() {
    return request({
        url: '/api/basicData',
        method: 'get',
        data: {
            type: '老年人信息'
        }
    })
}

// 获取监管信息
export function getRegulatoryInfo() {
    return request({
        url: '/api/basicData',
        method: 'get',
        data: {
            type: '监管信息'
        }
    })
}

// 获取健康状态信息
export function getHealthStatusInfo() {
    return request({
        url: '/api/basicData',
        method: 'get',
        data: {
            type: '健康状态'
        }
    })
}

// 获取居住状态信息
export function getResidenceStatusInfo() {
    return request({
        url: '/api/basicData',
        method: 'get',
        data: {
            type: '居住状态'
        }
    })
}

// 获取老年人总数信息
export function getTotalCountInfo() {
    return request({
        url: '/api/basicData',
        method: 'get',
        data: {
            type: '老年人数量'
        }
    })
}

// 地图坐标以及摄像头信息
export function getMapData () {
    return request({
        url: '/institution/institution/listTypeShow',
        method: 'get',
    })
}

// 地图区域信息
export function getMapRangeData () {
    return request({
        url: '/api/basicDataRange',
        method: 'get',
    })
}