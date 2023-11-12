import request from '@/utils/request'

// 分页
export function list(query) {
    return request({
        url: '/form/func/list',
        method: 'get',
        params: query
    })
}

// 通过formId查询列表
export function listByForm(query) {
    return request({
        url: '/form/func/listByForm',
        method: 'get',
        params: query
    })
}
// 新增
export function addForm(data) {
    return request({
        url: '/form/func',
        method: 'post',
        data: data
    })
}

// 修改
export function updateForm(data) {
    return request({
        url: '/form/func',
        method: 'put',
        data: data
    })
}

// 删除
export function delForm(funcIds) {
    return request({
        url: '/form/func/' + funcIds,
        method: 'delete'
    })
}


