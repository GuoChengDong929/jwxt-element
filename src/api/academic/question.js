import axios from '@/libs/api.request.js'

export const getList = data => {
    return axios.request({
        url:'question/list',
        method:'post',
        data:data
    });
};

export const save = data => {
    return axios.request({
        url:'question/save',
        method:'post',
        data:data
    });
};

export const update = data => {
    return axios.request({
        method:'put',
        data:data,
        url:'question/update'
    });
};

export const saveOrUpdate = data => {
    return data.id ? update(data) : save(data);
};

export const getQuestionsByChapterIdsAndQuestionTypeIds = data => {
    return axios.request({
        method:'post',
        data:data,
        url:'question/getQuestionsByChapterIdsAndQuestionTypeIds'
    });
};

export const exportData = data => {
    return axios.request({
        method:'post',
        data:data,
        url:'question/exportData',
        responseType: "blob"  //json text blob 大数据类型 excel他不是json 用blob类型来做响应的格式处理
    });
};