import axios from "axios";

export function getDTRConfigList(){
    return axios.request({
        method:'GET',
        url:'/api/dtrmgtconfig/getDTRConfigList'
    })
}
export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'/api/dtrmgtconfig/getAllOffices'
    })
}
export function addDTRConfig(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/dtrmgtconfig/addDTRConfig'
    })
}
export function updateDTRConfig(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/dtrmgtconfig/updateDTRConfig'
    })
}
export function deleteDTRConfig(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/dtrmgtconfig/deleteDTRConfig'
    })
}