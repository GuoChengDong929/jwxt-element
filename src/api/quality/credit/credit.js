import axios from '@/libs/api.request.js';

export const getClassesName = data => {
    return axios.request({
        method: 'get',
        url: '/credit/getClassesName',
        data: null
    })
}

export const getCreditList = data => {
    return axios.request({
        method: 'post',
        url: '/credit/getCreditList',
        data: data
    })
}

export const save = data => {
    return axios.request({
        method: 'post',
        url: '/credit/save',
        data: data
    })
}
