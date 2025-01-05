import axios from "axios";

export function getApproverData(){
    return axios.request({
        method:'GET',
        url:'api/traineeapprover/getApproverData'
    })
}
export function searchEmployee(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/employee/searchEmployee'
    })
}
export function getAllOfficeList(){
    return axios.request({
        method:'GET',
        url:'api/traineeapprover/getAllOfficeList'
    })
}
export function addTraineeApprover(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapprover/addTraineeApprover'
    })
}
export function deleteTraineeApprover(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapprover/deleteTraineeApprover'
    })
}
export function updateTraineeApprover(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapprover/updateTraineeApprover'
    })
}
export function getAllTraineeEvaluator(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapprover/getAllTraineeEvaluator'
    })
}
export function addTraineeEvaluator(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapprover/addTraineeEvaluator'
    })
}
export function deleteTraineeEvaluator(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapprover/deleteTraineeEvaluator'
    })
}
export function updateTraineeEvaluator(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/traineeapprover/updateTraineeEvaluator'
    })
}