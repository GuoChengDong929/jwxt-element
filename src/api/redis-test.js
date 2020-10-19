import axios from '@/libs/api.request.js'



export const initData = ()=>{
	return axios.request({
		method:'get',
		url:'hash/initData',
		data:null
	});
}

export const findAllOrders = ()=>{
	return axios.request({
		method:'get',
		url:'hash/findAllOrders',
		data:null
	});
}

export const changeOrderTotal = data =>{
	return axios.request({
		method:'post',
		url:'hash/changeOrderTotal',
		data:data
	}); 
}