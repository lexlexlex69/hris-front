import axios from "axios";

export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'/api/employee/getAllOffices'
    })
}
export function getDivisions(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getDivisions'
    })
}
export function getSections(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getSections'
    })
}
export function addEncoder(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/workschedule/addEncoder'
    })
}
export function addApprover(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/workschedule/addApprover'
    })
}
export function deleteEncoder(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/workschedule/deleteEncoder'
    })
}
export function deleteApprover(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/workschedule/deleteApprover'
    })
}
export function updateEncoderData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/workschedule/updateEncoderData'
    })
}
export function updateApproverData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/workschedule/updateApproverData'
    })
}
export function getEncoderApprover(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/workschedule/getEncoderApprover'
    })
}