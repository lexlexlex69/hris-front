import axios from 'axios';

export function getHeader(){
    return axios.request({
        method:'post',
        url:'api/opcr/getHeader'
    });
}
export function updateHeader(data){
    return axios.request({
        method:'post',
        data:data,
        url:'api/opcr/updateHeader'
    });
}
export function lookUpAPCR(data){
    return axios.request({
        method:'post',
        data:data,
        url:'api/opcr/lookUpAPCR'
    });
}
export function addOPCR(data){
    return axios.request({
        method:'post',
        data:data,
        url:'api/opcr/addOPCR'
    });
}
export function getOPCR(data){
    return axios.request({
        method:'post',
        data:data,
        url:'api/opcr/getOPCR'
    });
}