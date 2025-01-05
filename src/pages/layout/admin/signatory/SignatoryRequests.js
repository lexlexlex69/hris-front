import axios from "axios";

export function getAssignedSignatory(){
    return axios.request({
        method:'GET',
        url:'/api/signatory/getAssignedSignatory'
    })
}
export function updateHighRankSignatory(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/signatory/updateHighRankSignatory'
    })
}