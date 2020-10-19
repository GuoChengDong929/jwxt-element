import axios from '@/libs/api.request.js'
import { EPROTO } from 'constants';

export const list = data => {
	return axios.request({
		method:'post',
		data:data,
		url:'chapter/list'
	});
};

export const findChapters = () => {
	return axios.request({
		method:'get',
		data:null,
		url:'chapter/findChapters'
	});
};

export const getChapterList = data => {
	return axios.request({
		method:'post',
		data:data,
		url:`chapter/getChapterList/${data.id}`
	});
};


export const save = data => {
	return axios.request({
		method:'post',
		data:data,
		url:`chapter/save`
	});
};

export const update = data => {
	return axios.request({
		method:'put',
		data:data,
		url:`chapter/update`
	});
};

export const saveOrUpdate = data => {
	return data.id ? update(data) : save(data);
};