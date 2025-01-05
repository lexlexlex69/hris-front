import axios from "axios";

export function getEmployeeList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/emptrainings/getEmployeeList'
    })
}
export function unblockEmployee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/emptrainings/unblockEmployee'
    })
}
export function blockEmployee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/emptrainings/blockEmployee'
    })
}
export function getMetatags(){
    return axios.request({
        method:'GET',
        url:'/api/emptrainings/getMetatags'
    })
}
export function updateEmployeeMetatags(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/emptrainings/updateEmployeeMetatags'
    })
}
export function getSpecificEmployeeTrainings(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/emptrainings/getSpecificEmployeeTrainings'
    })
}
export function getTrainingsSummary(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/emptrainings/getTrainingsSummary'
    })
}
export function getSpecifiedTrainingsSummary(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/emptrainings/getSpecifiedTrainingsSummary'
    })
}
export function getAllEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'/api/employee/getAllEmpList'
    })
}