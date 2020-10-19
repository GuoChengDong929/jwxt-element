import axios from '@/libs/api.request.js'

export const test = ()=>{
	axios.request({
		method:'get',
		url:'test',
		data:null
	});
}