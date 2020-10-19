import axios from '@/libs/api.request.js'

export const getErrorLogList = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:'error/list'
    });
};