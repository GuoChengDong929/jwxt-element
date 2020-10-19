import axios from '@/libs/api.request.js'

const api = "teacher";

export const login = data => {
  return axios.request({
    url:`sys/login`,
    data:data,
    method:'post'
  });
};

export const getUserInfo  = () =>{
  return axios.request({
    url:`sys/profile`,
    data:null,
    method:'get'
  });
};

export const logout = () =>{
  return axios.request({
    url:`${api}/logout`,
    data:null,
    method:'get'
  });
};

//发送短信
export const sendNode = data =>{
  return axios.request({
    url:`sys/sendNode`,
    data:data,
    method:'post'
  })
};
