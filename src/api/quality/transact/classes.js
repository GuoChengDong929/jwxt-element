import axios from '@/libs/api.request.js'

export const list = data => {
    return axios.request({
        method:"post",
        url:`classes/list`,
        data:data
    });
};

export const save = data => {
    return axios.request({
        method:'post',
        data:data,
        url:'classes/save'
    });
};

export const update = data => {
    return axios.request({
        method:'put',
        data:data,
        url:'classes/update'
    });
};

export const saveOrUpdate = data => {
    return data.id ? update(data) : save(data);
};

export const findAll = () => {
    return axios.request({
        method:'post',
        data:null,
        url:'classes/findAll'
    });
};

export const invalid = data => {
    return axios.request({
        method:'put',
        data:data,
        url:'classes/invalid'
    });
};

export const getClassesListById = data =>{
    return axios.request({
        method:'get',
        data:data,
        url:'classes/getClassesListById'
    })
}