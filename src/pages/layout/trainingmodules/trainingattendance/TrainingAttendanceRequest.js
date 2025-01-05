import axios from "axios";

export function getAllTrainingDetails(){
    return axios.request({
        method:'GET',
        url:'api/training/getAllTrainingDetails'
    })
}
export function getTrainingParticipants(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getTrainingParticipants'
    })
}
export function addTrainingAttendance(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/addTrainingAttendance'
    })
}
export function getAllAttendance(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getAllAttendance'
    })
}
export function deleteSpecificTraineeAttendance(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/deleteSpecificTraineeAttendance'
    })
}
export function deleteSpecificDatePeriodAttendance(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/deleteSpecificDatePeriodAttendance'
    })
}
export function getAttendanceSummary(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getAttendanceSummary'
    })
}
export function getUnAttendedTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getUnAttendedTrainee'
    })
}
export function insertAttendance(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/insertAttendance'
    })
}