import axios from "axios";
import { api_url } from "../../../../request/APIRequestURL";

export function getEmpListMRATU(data){
    return axios.request({
        method:'POST',
        // data:data,
        url:'api/mratu/getEmpListMRATU'
    })
}
export function getEarnTable(){
    return axios.request({
        method:'GET',
        // data:data,
        url:'api/earnleave/getEarnTable'
    })
}
export function getWorkSchedule(){
    return axios.request({
        method:'GET',
        // data:data,
        url:'api/earnleave/getWorkSchedule'
    })
}
// export function processEmpList(data){
//     return axios.request({
//         method:'POST',
//         data:data,
//         url:'api/earnleave/getEmpList'
//     })
// }
export function getEmpDTRAPIForRATU(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:api_url+'/getEmpDTRAPIForRATU'
        url:'api/DTR/getRATUDTR'
    })
}
export function uploadLetterHead(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/mratu/uploadLetterHead'
    })
}
export function getUploadedLetterHead(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/mratu/getUploadedLetterHead'
    })
}
export function searchEmployeePerDept(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/employee/searchEmployeePerDept'
    })
}
export function getMRATUSignatories(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/mratu/getMRATUSignatories'
    })
}
export function updateMRATUSignatories(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/mratu/updateMRATUSignatories'
    })
}