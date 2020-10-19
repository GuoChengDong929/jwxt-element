import axios from '@/libs/api.request.js'

export const findTeachersByJobTitle = () =>{
    return axios.request({
        url:'teacher/findTeachersByJobTitle',
        method:'get',
        data:null
    });
};