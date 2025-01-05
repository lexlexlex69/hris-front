import axios from "axios"

export function checkPermission(id){
    return axios.request({
        method:'post',
        data: {
            data:id
        },
        url:'api/permission/checkPermission'
    })
}

export function checkRolePermission(id){
    return axios.request({
        method:'post',
        data: {
            data:id
        },
        url:'api/permission/checkRolePermission'
    })
}