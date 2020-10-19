import axios from '@/libs/api.request.js'

export const getListByDevice = data => {
    return axios.request({
        method:'post',
        data:data,
        url:'device/getListByDevice'
    });
};

export const deleteDevice = data =>{
    return axios.request({
        url:`/device/deleteDevice/${data.id}`,
        method:'delete',
        data:null
    })
}
