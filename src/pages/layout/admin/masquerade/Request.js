import axios from "axios";
export function searchEmpMasquerade(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/masquerade/searchEmpMasquerade'
    })
} 
export function execute(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/masquerade/execute'
    })
} 
export function masqueradeUser(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/user/masqueradeUser'
    })
} 