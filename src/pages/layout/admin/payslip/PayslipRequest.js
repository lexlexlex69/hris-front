import axios from "axios";
import { api_url } from "../../../../request/APIRequestURL";
// var api_url = 'http://localhost/Butuan/HRIS/';
// var api_url = 'https://test.butuan.gov.ph/hris-api/';
export function getEmpInfo(){
    return axios.request({
        method:'GET',
        url:'api/payslip/getEmpInfo'
    })
}
export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'api/employee/getAllOffices'
    })
}
export function getPaySlip(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/getPaySlip'
        // url:'https://test.butuan.gov.ph/hris-api/api/getPaySlip'
        url:api_url+'/getPaySlip'
    })
}
export function getEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/employee/getEmpList'
    })
}
export function getUserInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/employee/getUserInfo'
    })
}
export const api_url2 = api_url;
// export const api_url2 = 'https://test.butuan.gov.ph/hris-api/';
