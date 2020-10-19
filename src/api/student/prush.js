import axios from '@/libs/api.request.js'

export const getQuestionsByChapter = data => {
    return axios.request({
        url:'brush/getQuestionsByChapter',
        method:'post',
        data:data
    });
};

export const updateOk = data =>{
    return axios.request({
        url:`brush/updateOk`,
        method:'post',
        data:data
    });
};

export const removeOk = data => {
    return axios.request({
        url:`brush/removeOk`,
        method:'post',
        data:data
    });
};