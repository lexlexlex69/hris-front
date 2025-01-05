import axios from "axios";
import { api_url } from "../../../../request/APIRequestURL";

export function getEmpListSRATU(data){
    return axios.request({
        method:'POST',
        // data:data,
        url:'api/sratu/getEmpListSRATU'
    })
}
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
export function getSRATUSignatories(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/sratu/getSRATUSignatories'
    })
}
export function updateSRATUSignatories(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/sratu/updateSRATUSignatories'
    })
}