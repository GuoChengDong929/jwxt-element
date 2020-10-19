import axios from '@/libs/api.request.js'

export const findHttpTraces = () =>{
    return axios.request({
        url:'actuator/httptrace',
        method:'get',
        data:null
    });
};
