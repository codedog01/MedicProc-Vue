import request from '@/utils/request'

export function dbTableList(query) {
    return request({
        url: '/form/template/dbTableList',
        method: 'get',
        params: query
    })
}

export function domainDetail(query) {
    console.log(query);
    return request({
        url: '/form/template/domainDetail',
        method: 'get',
        params: query
    })
}
