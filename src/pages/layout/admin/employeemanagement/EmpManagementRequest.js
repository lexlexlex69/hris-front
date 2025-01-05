import axios from "axios";

export function searchEmployee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/searchEmployee'
    })
}
export function updateEmployeeBasicInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/updateEmployeeBasicInfo'
    })
}
export function addNewEmployeeInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/addNewEmployeeInfo'
    })
}
export function getEmpStatus(){
    return axios.request({
        method:'GET',
        url:'/api/employee/getEmpStatus'
    })
}
export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'/api/employee/getAllOffices'
    })
}
export function getDeptDiv(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getDeptDiv'
    })
}
export function getDeptDivList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getDeptDivList'
    })
}
export function getEmpListGroupings(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getEmpListGroupings'
    })
}
export function addDeptDiv(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/addDeptDiv'
    })
}
export function deleteDivEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/deleteDivEmpList'
    })
}
export function addDivEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/addDivEmpList'
    })
}
export function getDivSecList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getDivSecList'
    })
}
export function addDivSection(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/addDivSection'
    })
}
export function deleteDivSection(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/deleteDivSection'
    })
}
export function getDivSecUnsetEmp(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getDivSecUnsetEmp'
    })
}
export function getDivSecEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getDivSecEmpList'
    })
}
export function deleteDivSecEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/deleteDivSecEmpList'
    })
}
export function addDivSecEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/addDivSecEmpList'
    })
}
export function getDivisions(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getDivisions'
    })
}
export function getSections(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getSections'
    })
}