import request from '@/utils/request'


// 查询缓存详细
export function toDataEase() {
    return request({
        url: '/dataEaseSSO/ssoCall',
        method: 'get'
    })
}

export function outDataEase() {
    return request({
        url: '/dataEaseSSO/logout',
        method: 'get'
    })
}