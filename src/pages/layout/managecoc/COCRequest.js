import axios from "axios";
import { api_url } from "../../../request/APIRequestURL";

export function getAllCOCData(){
    return axios.request({
        method:'GET',
        url:'api/cocentry/getAllCOCData'
    })
} 
export function addCOCEarned(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/managecoc/addCOCEarned'
    })
} 
export function searchEmployee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/managecoc/searchEmployee'
    })
} 
export function searchEmployeeCOC(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/managecoc/searchEmployeeCOC'
    })
} 
export function getCOCEarningHistory(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/managecoc/getCOCEarningHistory'
    })
} 
export function approvedCOCApplication(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/managecoc/approvedCOCApplication'
    })
} 
export function getOvertimeDtl(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/managecoc/approvedCOCApplication'
    })
} 
export function disapprovedCOCApplication(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/managecoc/disapprovedCOCApplication'
    })
} 
export function getSignatory(id){
    return axios.request({
        method:'GET',
        url:api_url+'/getSignatory/'+id
    })
}
export function getCOCEarned(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/managecoc/getCOCEarned'
    })
}
export function updateCOCEarned(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/managecoc/updateCOCEarned'
    })
}