import axios from "axios";
import { api_url } from "../../../../../request/APIRequestURL";
import { API_KEY } from "../../../customstring/CustomString";
export function setUpPayroll(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/setUpPayroll'
    })
}
export function getDeptPayroll(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getDeptPayroll'
    })
}
export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'/api/employee/getAllOffices'
    })
}
// export function getPayrollSignatories(data){
//     return axios.request({
//         method:'POST',
//         data:data,
//         url:'/api/employee/getPayrollSignatories'
//     })
// }
export function getPayrollGroup(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPayrollGroup'
    })
}
export function getPayrollGroupPerOffice(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPayrollGroupPerOffice'
    })
}
export function addPayrollGroupPerOffice(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/addPayrollGroupPerOffice'
    })
}
export function deleteEmpPayrollGroup(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/deleteEmpPayrollGroup'
    })
}
export function addEmpPayrollGroup(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/addEmpPayrollGroup'
    })
}
// export function addEmpPayrollGroup(data){
//     return axios.request({
//         method:'POST',
//         data:data,
//         url:'/api/payroll/addEmpPayrollGroup'
//     })
// }
export function getEmpStatus(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getEmpStatus'
    })
}
export function getEmpPerDeptStatus(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getEmpPerDeptStatus'
    })
}
export function updateWTax(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/updateWTax'
    })
}
export function getFixContrib(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getFixContrib'
    })
}
export function addFixContrib(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/addFixContrib'
    })
}
export function updateFixContrib(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/updateFixContrib'
    })
}
export function deleteFixContrib(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/deleteFixContrib'
    })
}
export function getPayrollSignatories(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPayrollSignatories'
    })
}
export function updatePayrollSignatories(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/updatePayrollSignatories'
    })
}
export function getDeptSpecialPayroll(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getDeptSpecialPayroll'
    })
}
export function getEmpListPerOffices(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getEmpListPerOffices'
    })
}
export function postPayroll(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/postPayroll'
    })
}
export function getPayrollGroupData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPayrollGroupData'
    })
}
export function getPayrollData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPayrollData'
    })
}
export function getPayGroupData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPayGroupData'
    })
}
export function getPayGroupDtl(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPayGroupDtl'
    })
}
export function deleteLoan(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/deleteLoan'
    })
}
export function savePayrollUpdate(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/savePayrollUpdate'
    })
}
export function deleteEmpPayroll(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/deleteEmpPayroll'
    })
}
export function lockPayrollRecords(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/lockPayrollRecords'
    })
}
export function finalizedPayrollRecords(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/finalizedPayrollRecords'
    })
}
export function unlockPayrollRecords(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/unlockPayrollRecords'
    })
}
export function deletePayrollGroupDtl(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/deletePayrollGroupDtl'
    })
}
export function getPaySetup(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/getPaySetup'
    })
}
export function deletePaySetup(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/deletePaySetup'
    })
}
export function deletePayGroup(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/deletePayGroup'
    })
}
export function getPayType(){
    return axios.request({
        method:'GET',
        url:api_url+'/gPayType/'+API_KEY
        // url:'/api/payroll/getPayType'
    })
}
export function getPayClerk(){
    return axios.request({
        method:'GET',
        url:api_url+'/gPayClerk/'+API_KEY
    })
}
export function getPayAllowance(){
    return axios.request({
        method:'GET',
        url:api_url+'/gPayAllowance/'+API_KEY
    })
}
export function getPayGroupAPI(){
    return axios.request({
        method:'GET',
        url:api_url+'/gPayGroup/'+API_KEY
    })
}
export function getDeptPayGroupAPI(dept_code,emp_status){
    return axios.request({
        method:'GET',
        url:api_url+'/gDeptPayGroup/'+dept_code+'/'+emp_status+'/'+API_KEY
    })
}
export function postPaySetup(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/payroll/postPaySetup'
        // url:'http://online.butuan.gov.ph/Butuan/OnlineServices/api/PAYROLL/setup_payroll'
    })
}