import axios from "axios";

export function getDeptPaySetupData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getDeptPaySetupData'
    });
}
export function getPaySignatories(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPaySignatories'
    });
}
export function getDeptPayData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getDeptPayData'
    });
}