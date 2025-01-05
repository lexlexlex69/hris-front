import axios from "axios";
import { api_url } from "../../../../request/APIRequestURL";

export function getBalance(){
    return axios.request({
        method:'POST',
        url:'api/overtimememo/getBalance'
    })
} 
export function getOvertimeDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/getOvertimeDetails'
    })
}
export function getDTRAPI(data){
    return axios.request({
        method:'POST',
        headers:{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            // 'Access-Control-Allow-Credentials':false,
            'Content-Type': 'application/json'
        },
        data:data,
        url:api_url+'/getEmpDTRAPIForCOC'
    })
}
export function getEmpCOCLedger(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/getEmpCOCLedger'
    })
} 
export function addCOCApplication(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/addCOCApplication'
    })
} 
export function getSignatory(id){
    return axios.request({
        method:'GET',
        url:api_url+'/getSignatory/'+id
    })
} 
export function deleteCOCApplication(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/deleteCOCApplication'
    })
}
export function checkManualCOCEarning(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/overtimememo/checkManualCOCEarning'
    })
} 