import axios from "axios";

export function getAllHeadOfOfficeData(){
    return axios.request({
        method:'GET',
        url:'api/headofofficeconfig/getAllHeadOfOfficeOICData'
    })
}
export function getAllOfficeData(){
    return axios.request({
        method:'GET',
        url:'api/headofofficeconfig/getAllOfficeData'
    })
}
export function updateHeadOfficeOIC(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/headofofficeconfig/updateHeadOfficeOIC'
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
export function addHeadOfficeOIC(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/headofofficeconfig/addHeadOfficeOIC'
    })
} 
export function deleteHeadOfficeOIC(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/headofofficeconfig/deleteHeadOfficeOIC'
    })
}
export function updateHeadOfOffice(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/headofofficeconfig/updateHeadOfOffice'
    })
} 
export function getOfficeNotAdded(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/headofofficeconfig/getOfficeNotAdded'
    })
}
export function addNewOfficeHead(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/headofofficeconfig/addNewOfficeHead'
    })
} 