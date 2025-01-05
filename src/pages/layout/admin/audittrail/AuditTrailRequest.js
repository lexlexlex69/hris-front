import axios from "axios";

export function getOfficeEmp(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/audittrail/getOfficeEmp'
    });
}
export function getEmpLogs(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/audittrail/getEmpLogs'
    });
}
export function searchEmployee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/employee/searchEmployee'
    });
}
export function searchEmployeeLogs(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/audittrail/searchEmployee'
    });
}
export function searchHistoryLogs(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/audittrail/searchHistoryLogs'
    });
}