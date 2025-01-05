import axios from "axios";

export function getAllTypesOfLeave(){
    return axios.request({
        method:'GET',
        url:'api/leavetype/getAllTypesOfLeave'
    })
}
export function addNewTypeOfLeave(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/leavetype/addNewTypeOfLeave'
    })
}
export function updateTypeOfLeave(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/leavetype/updateTypeOfLeave'
    })
}
export function deleteTypeOfLeave(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/leavetype/deleteTypeOfLeave'
    })
}