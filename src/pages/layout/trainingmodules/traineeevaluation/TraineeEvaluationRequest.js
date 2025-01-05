import axios from "axios";

export function getTrainees(){
    return axios.request({
        method:'GET',
        url:'api/training/getTrainees'
    })
}
export function getEvaluateTrainees(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getEvaluateTrainees'
    })
}
export function getCompleteEvaluateTrainees(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getCompleteEvaluateTrainees'
    })
}
export function getInCompleteEvaluateTrainees(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getInCompleteEvaluateTrainees'
    })
}
export function getEvaluatedTrainees(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getEvaluatedTrainees'
    })
}
export function addTraineeEvaluation(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/addTraineeEvaluation'
    })
}
export function notifyParticipants(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/notifyParticipants'
    })
}
export function getInitalLAPSAP(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getInitalLAPSAP'
    })
}
export function approvedInitalLAPSAP(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/approvedInitalLAPSAP'
    })
}
export function disapprovedInitalLAPSAP(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/disapprovedInitalLAPSAP'
    })
}