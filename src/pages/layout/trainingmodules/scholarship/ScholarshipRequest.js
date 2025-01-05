import axios from "axios";

export function getAllScholarship(data){
    return axios.request({
        method:'GET',
        data:data,
        url:'api/scholarship/getAllScholarship'
    })
}
export function addNewScholarship(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/scholarship/addNewScholarship'
    })
}
export function updateScholarship(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/scholarship/updateScholarship'
    })
}
export function deleteScholarship(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/scholarship/deleteScholarship'
    })
}