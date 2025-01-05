import axios from "axios";

export function getEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/payslip/getEmpList'
    })
}
export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'api/employee/getAllOffices'
    })
}