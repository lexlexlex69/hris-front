import axios from "axios";

export function getTrainingRequirements(){
    return axios.request({
        method:'GET',
        url:'api/managetrainingrequirements/getTrainingRequirements'
    })
}
export function addTrainingRequirements(data){
    return axios.request({
        method:'post',
        data:data,
        url:'api/managetrainingrequirements/addTrainingRequirements'
    })
}
export function deleteTrainingRequirements(data){
    return axios.request({
        method:'post',
        data:data,
        url:'api/managetrainingrequirements/deleteTrainingRequirements'
    })
}
export function updateTrainingRequirements(data){
    return axios.request({
        method:'post',
        data:data,
        url:'api/managetrainingrequirements/updateTrainingRequirements'
    })
}