import axios from '@/libs/api.request.js'

export const findAll = () => {
	return axios.request({
		method:'get',
		data:null,
		url:'curriculum/findAll'
	}); 
};

export const list = data =>{
	return axios.request({
		method:'post',
		data:data,
		url:'curriculum/list'
	});
};

export const save = data =>{
	return axios.request({
		method:'post',
		data:data,
		url:'curriculum/save'
	}); 
};

export const update = data =>{
	return axios.request({
		method:'put',
		data:data,
		url:'curriculum/update'
	}); 
}

export const saveOrUpdate = data =>{
	return data.id ? update(data) : save(data);
};
