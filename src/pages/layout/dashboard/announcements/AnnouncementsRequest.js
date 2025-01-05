import axios from "axios";

export function getAvailableScholarship(){
    return axios.request({
        method:'GET',
        url:'api/announcements/getAvailableScholarship'  
    })
}
export function getAvailableTraining(){
    return axios.request({
        method:'GET',
        url:'api/announcements/getAvailableTraining'  
    })
}