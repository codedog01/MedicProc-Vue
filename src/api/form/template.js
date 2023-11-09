import request from '@/utils/request'

export function getEntityList(query) {
    return request({
        url: '/form/template/getEntityList',
        method: 'get',
        params: query
    })
}

export function entityDetail(query) {
    console.log(query);
    return request({
        url: '/form/template/entityDetail',
        method: 'get', 
        params: query
    })
}
