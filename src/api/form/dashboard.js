import request from '@/utils/request'

// 查询列表
export function listForm(query) {
    return request({
        url: '/form/generator/list',
        method: 'get',
        params: query
    })
}


// 新增
export function addForm(data) {
    return request({
        url: '/form/generator',
        method: 'post',
        data: data
    })
}

// 修改
export function updateForm(data) {
    return request({
        url: '/form/generator',
        method: 'put',
        data: data
    })
}

// 删除
export function delForm(formId) {
    return request({
        url: '/form/generator/' + formId,
        method: 'delete'
    })
}


