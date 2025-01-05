import axios from "axios";

export function getAllEmployee(){
    return axios.request({
        method:'POST',
        url:'api/overtimememo/getAllEmployee'
    })
} 
export function getOvertimeDetailsPerDept(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/getOvertimeDetailsPerDept'
    })
} 
export function addOvertimeDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/addOvertimeDetails'
    })
} 
export function deleteEmpOvertimeDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/deleteEmpOvertimeDetails'
    })
}
export function getEmpOvertimeDates(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/getEmpOvertimeDates'
    })
} 
export function updateEmpOvertimeDates(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/updateEmpOvertimeDates'
    })
} 