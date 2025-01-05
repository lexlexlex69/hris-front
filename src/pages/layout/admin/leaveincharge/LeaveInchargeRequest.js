import axios from "axios";

export function getAllLeaveInCharge(){
    return axios.request({
        method:'GET',
        url:'api/leaveincharge/getAllLeaveInCharge'
    })
}
export function deleteLeaveInCharge(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveincharge/deleteLeaveInCharge'
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
export function getEmpStatus(){
    return axios.request({
        method:'GET',
        url:'api/employee/getEmpStatus'
    })
}
export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'api/employee/getAllOffices'
    })
}
export function addLeaveInCharge(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveincharge/addLeaveInCharge'
    })
}
export function updateLeaveInCharge(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveincharge/updateLeaveInCharge'
    })
}
export function addHRApprovalAssigned(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveincharge/addHRApprovalAssigned'
    })
}
export function deleteHRApprovalAssigned(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveincharge/deleteHRApprovalAssigned'
    })
}
export function updateHRApprovalAssigned(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveincharge/updateHRApprovalAssigned'
    })
}
export function getUniqueLeaveIncharge(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveincharge/getUniqueLeaveIncharge'
    })
}
export function postLeaveInchargeSignatory(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveincharge/postLeaveInchargeSignatory'
    })
}