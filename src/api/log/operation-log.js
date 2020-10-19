import axios from '@/libs/api.request.js'

export const getLogList = data => {
    return axios.request({
        method:'post',
        data:data,
        url:'operation/list'
    });
};