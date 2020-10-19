import axios from "@/libs/api.request";

export const getDayScoreByDate = data => {
  return axios.request({
      url:'supervise/getScoresByDate',
      data:data,
      method:'post'
  });
};


export const getWeekScoresByDate = data => {
    return axios.request({
        url:'supervise/getWeekScoresByDate',
        data:data,
        method:'post'
    });
};

export const getMonthScoresByDate = data => {
    return axios.request({
        url:'supervise/getMonthScoresByDate',
        data:data,
        method:'post'
    });
};

export const getStudentScores = data =>{
    return axios.request({
        url:'supervise/getStudentScores',
        data:data,
        method:'post'
    });
};

export const comparisonMonth = data => {
    return axios.request({
        url:'supervise/comparisonMonth',
        data:data,
        method:'post'
    });
};

export const comparisonDay = data =>{
    return axios.request({
        url:'supervise/comparisonDay',
        data:data,
        method:'post'
    })
};

export const comparisonWeek = data =>{
    return axios.request({
        url:'supervise/comparisonWeek',
        data:data,
        method:'post'
    })
}
