import axios from "axios";

export function getJobList(type){
    return axios.request({
        method:'POST',
        url:'/api/getJobList',
        data: {
            data:type
        }
    })
    
}
export function getAllJobPostingList(type){
    return axios.request({
        method:'POST',
        url:'/api/getAllJobPostingList',
        data: {
            data:type
        }
    })
    
}
export function jobPostingAction(data2){
    return axios.request({
        method:'POST',
        url:'/api/jobPostingAction',
        data: {
            data:data2
        }
    })
    
}
export function postJobVacancies(data){
    return axios.request({
        method:'POST',
        url:'/api/postJobVacancies',
        data: {
            data:data
        }
    })
    
}