import axios from "axios"

export function getFinishedTrainings(){
    return axios.request({
        method:'GET',
        url:'api/certificate/getFinishedTrainings'
    })
}
export function getCompletedTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/certificate/getCompletedTrainee'
    })
}
export function getTemplate(){
    return axios.request({
        method:'GET',
        url:'api/certificate/getTemplate'
    })
}