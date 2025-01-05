import axios from "axios";

export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'/api/employee/getAllOffices'
    })
}

export function getRegCasEmpListPerOffices(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getRegCasEmpListPerOffices'
    })
}
export function getEmpLedger(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/leaveapplication/getEmpLedger'
    })
}
export function postEmpLedger(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/leaveapplication/postEmpLedger'
    })
}
export function postBeginningBalance(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/leaveapplication/postBeginningBalance'
    })
}