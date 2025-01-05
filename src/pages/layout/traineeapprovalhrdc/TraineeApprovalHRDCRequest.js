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
export function getAllApprovedTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapproval/getAllApprovedTrainee'
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
export function getEmployeeList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/emptrainings/getEmployeeList'
    })
}
export function addNewTrainees(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/addNewTrainees'
    })
}
export function getDeptReserved(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/getDeptReserved'
    })
}

export function hrdcApproval(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/hrdcApproval'
    })
}
export function hrdcUpdateSlot(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/hrdcUpdateSlot'
    })
}
export function getAllRequestedReplacement(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/getAllRequestedReplacement'
    })
}
export function actionRequestedReplacement(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/actionRequestedReplacement'
    })
}
export function getAllReservedTraineePerDept(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/getAllReservedTraineePerDept'
    })
}
export function addRemoveTraineeHRDC(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/addRemoveTraineeHRDC'
    })
}
export function disapprovedTraineeReplacement(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/disapprovedTraineeReplacement'
    })
}
export function updateResolution(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/traineeapproval/updateResolution'
    })
}
