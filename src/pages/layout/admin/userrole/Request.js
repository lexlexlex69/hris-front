import axios from "axios";

export function checkPassword(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/userconfiguration/checkPassword'
    });
}
export function getActionPerm(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/userconfiguration/getActionPerm'
    });
}

export function getAllUser(){
    return axios.request({
        method:'GET',
        url:'api/userconfiguration/getAllUser'
    });
}
export function getAllRoles(){
    return axios.request({
        method:'GET',
        url:'api/userconfiguration/getAllRoles'
    });
}
export function getAllPermissions(){
    return axios.request({
        method:'GET',
        url:'api/userconfiguration/getAllPermissions'
    });
}
export function getUserRoles(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/userconfiguration/getUserRoles'
    });
}
export function addNewRole(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/userconfiguration/addNewRole'
    });
}
export function deleteUserRole(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/userconfiguration/deleteUserRole'
    });
}
export function deleteRole(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/userconfiguration/deleteRole'
    });
}
export function getDistinctUserRoles(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/userconfiguration/getDistinctUserRoles'
    });
}
export function adduserRole(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/userconfiguration/adduserRole'
    });
}
export function updateRole(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/userconfiguration/updateRole'
    });
}
export function updatePermissionMenu(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/userconfiguration/updatePermissionMenu'
    });
}
export function resetUserPassword(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/userconfiguration/resetUserPassword'
    });
}
export function getEmpStatus(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/userconfiguration/getEmpStatus'
    });
}
export function deleteUser(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/userconfiguration/deleteUser'
    });
}
export function resetDateUpdatedBal(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/userconfiguration/resetDateUpdatedBal'
    });
}
export function temporaryChangePassword(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/userconfiguration/temporaryChangePassword'
    });
}
export function rollbackPassword(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/userconfiguration/rollbackPassword'
    });
}
export function updateUserToEmployee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/userconfiguration/updateUserToEmployee'
    });
}
