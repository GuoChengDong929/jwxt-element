import axios from '@/libs/api.request.js'

export const getExamList = data =>{
    return axios.request({
        url:"exam/getExamList",
        data:data,
        method:'post'
    });
};

export const saveExam = data => {
    return axios.request({
        url:'exam/save',
        data:data,
        method:'post'
    });
};

export const startExam = data => {
    return axios.request({
        url:'exam/start',
        data:data,
        method:'post'
    });
};

export const findById = data =>{    //开始考试前,确认考试状态没被定时器修改
    return axios.request({
        url:`exam/findById/${data.id}`,
        method:'get',
        data:null
    });
};

export const findExamByCache = data => { //查看试卷(教师) 答题试卷(学生)
    return axios.request({
        url:`exam/findExamByCache/${data.id}`,
        method:'get',
        data:null
    });
};

export const getStudentListByExam = data => { //
    return axios.request({
        method:'post',
        data:data,
        url:`exam/getStudentListByExam`
    });
};

export const stop = data =>{ //停止答卷
    return axios.request({
        method:'post',
        data:data,
        url:`exam/stop`
    });
};

export const analysisExam = data => { //试卷分析
    return axios.request({
        method:'post',
        data:data,
        url:`exam/analysisExam`
    });
};

export const findExamByDBHasAnswer = data => { //试卷讲解 带答案
    return axios.request({
        method:'post',
        data:data,
        url:`exam/findExamByDBHasAnswer`
    });
};

export const markingStudentAsks = data => {
    return axios.request({
        method:'post',
        data:data,
        url:`exam/markingStudentAsks`
    });
};

export const getStudentAskResult = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:`exam/getStudentAskResult`
    });
};

export const updateStudentAskScore = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:`exam/updateStudentAskScore`
    });
};

export const endExam = data => {
    return axios.request({
        method:'post',
        data:data,
        url:`exam/endExam`
    });
};