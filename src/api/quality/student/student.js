import axios from '@/libs/api.request.js'

export const list = data => {
    return axios.request({
        method: "post",
        url: `student/list`,
        data: data
    });
};

export const save = data => {
    return axios.request({
        method: 'post',
        data: data,
        url: 'student/save'
    });
};

export const update = data => {
    return axios.request({
        method: 'put',
        data: data,
        url: 'student/update'
    });
};

export const getStudentListByClassesId = data => {
    return axios.request({
        method: 'post',
        data: data,
        url: 'student/getStudentListByClassesId'
    })
}


export const saveOrUpdate = data => {
    return data.id ? update(data) : save(data);
};

