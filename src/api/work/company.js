import axios from '@/libs/api.request.js'

export const getCompanies = ()=>{
    return axios.request({
        method:'get',
        data:null,
        url:'company/getCompanies'
    });
}