import axios from '@/libs/api.request.js'

export const findAll = data =>{
    return axios.request({
        url:'interview/findAll',
        method:'get',
        data:data
    });
};

export const getInterviewInfo = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:'interview/getInterviewInfo'
    })
}

export const saveInterview = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:'interview/saveInterview'
    })
}

export const getListByInterview = data =>{
    return axios.request({
        method:'get',
        data:data,
        url:'interview/getListByInterview'
    })
}

export const getStudentList = data => {
    return axios.request({
        method: 'post',
        url: '/interview/getStudent',
        data: data
    })
}