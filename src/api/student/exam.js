import axios from '@/libs/api.request.js'

export const getList = data =>{
    return axios.request({
        url:'student/exam/getList',
        method:'post',
        data:data
    });
};

export const save = data => {
    return axios.request({
        url:'student/exam/save',
        method:'post',
        data:data
    });
};

export const getScoreStatus = data =>{
    return axios.request({
        url:`student/exam/getScoreStatus/${data.id}`,
        method:'get',
        data:null
    });
};

export const getExamStatus = data =>{
    return axios.request({
        url:`student/exam/getExamStatus/${data.id}`,
        method:'get',
        data:null
    });
};


export const getShowExamStatus = data =>{
    return axios.request({
        url:`student/exam/getShowExamStatus/${data.id}`,
        method:'get',
        data:null
    });
};


export const saveTempAnswer = data =>{
    return axios.request({
        url:'student/exam/saveTempAnswer',
        method:'post',
        data:data
    });
};

export const echoTempAnswer = data => { //回显临时数据
    return axios.request({
        url:`student/exam/echoTempAnswer/${data.id}`,
        method:'get',
        data:null
    });
};

export const findExamByDBHasAnswer = data => { //试卷讲解 带答案
    return axios.request({
        method:'post',
        data:data,
        url:`student/exam/findExamByDBHasAnswer`
    });
};

export const goBackStudentExamData = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:`student/exam/goBackStudentExamData`
    });
};

export const analysisExam = data => { //试卷分析
    return axios.request({
        method:'post',
        data:data,
        url:`student/exam/analysisExam`
    });
};