import axios from 'axios';

export function getDTREmplist(){
    return axios.request({
        method:'POST',
        url:'api/DTR/getDTREmplist'
    })
}
export function getMultipleEmpDTR(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/DTR/getMultipleEmpDTR'
    })
}
export function manualProcessDTR(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/DTR/manualProcessDTR'
    })
}