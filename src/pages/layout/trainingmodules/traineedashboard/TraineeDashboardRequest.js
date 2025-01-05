import axios from "axios";

export function getMyTrainings(){
    return axios.request({
        method:'GET',
        url:'api/training/getMyTrainings'
    })
}
export function updateRqmt(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/updateRqmt'
    })
}
export function updateRqmtTrainingApp(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/updateRqmtTrainingApp'
    })
}
export function getMyRqmt(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getMyRqmt'
    })
}
export function getMyDailyOutput(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getMyDailyOutput'
    })
}
export function updateMyDailyOutput(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/updateMyDailyOutput'
    })
}
export function getMyEvaluation(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getMyEvaluation'
    })
}
export function postMyEvaluation(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/postMyEvaluation'
    })
}
export function postLastDayEvaluation(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/postLastDayEvaluation'
    })
}
export function getLearningMaterials(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getLearningMaterials'
    })
}
export function testDate(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/testDate'
    })
}
export function uploadTraineeMOVFile(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/uploadTraineeMOVFile'
    })
}
export function getTraineeMOVFiles(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getTraineeMOVFiles'
    })
}
export function deleteTraineeMOVFiles(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/deleteTraineeMOVFiles'
    })
}
export function getInfoNotAttendedTraining(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getInfoNotAttendedTraining'
    })
}
export function postNotAttendedTraining(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/postNotAttendedTraining'
    })
}
export function addTrainingAppRequirements(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/addTrainingAppRequirements'
    })
}
export function updateFinalLAPSAP(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/updateFinalLAPSAP'
    })
}
export function getUpdatedLAPSAP(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getUpdatedLAPSAP'
    })
}