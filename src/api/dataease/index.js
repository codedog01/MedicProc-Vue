import request from '@/utils/request'


// 查询缓存详细
export function toDataEase() {
    return request({
        url: '/dataEase/login',
        method: 'get'
    })
}

export function outDataEase() {
    return request({
        url: '/dataEase/logout',
        method: 'get'
    })
}
