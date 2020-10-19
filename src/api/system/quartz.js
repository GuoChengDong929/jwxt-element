import axios from '@/libs/api.request.js'

export const getQuartzList = data => {
	return axios.request({
		method:'post',
		url:'quartz/list',
		data:data
	});
};

export const getClassesList = () => {
	return axios.request({
		method:'get',
		url:'classes/load',
		data:null
	});
};

export const isExist = data =>{
	return axios.request({
		method:'post',
		url:'quartz/isExist',
		data:data
	});
};

export const add = data => {
	return axios.request({
		method:'post',
		url:'quartz/add',
		data:data
	});
};

export const trigger = data => {
	return axios.request({
		method:'post',
		url:'quartz/trigger',
		data:data
	});
}


export const pause = data => {
	return axios.request({
		method:'post',
		url:'quartz/pause',
		data:data
	});
};

export const resume = data => {
	return axios.request({
		method:'post',
		url:'quartz/resume',
		data:data
	});
};

export const remove = data => {
	return axios.request({
		method:'post',
		url:'quartz/remove',
		data:data
	});
};