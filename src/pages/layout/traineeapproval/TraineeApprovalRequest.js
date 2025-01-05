import axios from "axios";

export function getTraineeApproval(){
    return axios.request({
        method:'GET',
        url:'api/traineeapproval/getTraineeApproval'
    })
}
export function getApprovedTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/getApprovedTrainee'
    })
}
export function getAllShortlistTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/getAllShortlistTrainee'
    })
}
export function updateApprovedTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/updateApprovedTrainee'
    })
}
export function getAllReservedTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/getAllReservedTrainee'
    })
}
export function postTraineeReplacement(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/postTraineeReplacement'
    })
}
export function getRequestedTraineeReplacement(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/getRequestedTraineeReplacement'
    })
}