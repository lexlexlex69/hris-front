import axios from 'axios';

export function getSurveyQuestions(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/survey/getSurveyQuestions'
    })
}
export function postDTRLeaveSurvey(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/survey/postDTRLeaveSurvey'
    })
}