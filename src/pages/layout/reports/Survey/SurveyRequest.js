import axios from "axios";

export function getSurveyList(){
    return axios.request({
        method:'POST',
        url:'api/survey/getSurveyList'
    })
}
export function getSurveyResponses(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/survey/getSurveyResponses'
    })
}