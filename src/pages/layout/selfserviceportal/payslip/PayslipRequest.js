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
export function postPaySlipHistory(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/payslip/postPaySlipHistory'
    })
    
}
export function getEmpPaySlip(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/payslip/getEmpPaySlip'
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
export function getPaySlip2(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/getPaySlip'
        // url:'https://test.butuan.gov.ph/hris-api/api/getPaySlip'
        url:api_url+'/getPaySlip2'
    })
}
export const api_url2 = api_url;
// export const api_url2 = 'https://test.butuan.gov.ph/hris-api/';
