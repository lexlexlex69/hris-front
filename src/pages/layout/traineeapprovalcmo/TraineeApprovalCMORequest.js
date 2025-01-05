import axios from "axios";

export function getTraineeApprovalHRDC(){
    return axios.request({
        method:'GET',
        url:'api/traineeapproval/getTraineeApprovalHRDC'
    })
}
export function getApprovedTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/getApprovedTrainee'
    })
}
export function getAllShortlistTraineeHRDC(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/getAllShortlistTraineeHRDC'
    })
}
export function updateApprovedTraineeHRDC(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/updateApprovedTraineeHRDC'
    })
}
export function officialApprovedTraineeHRDC(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/officialApprovedTraineeHRDC'
    })
}