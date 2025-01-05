import axios from 'axios'

export function getAllOffices(){
    return axios.request({
        method:'GET',
        url:'api/offices/getOffices'
    })
}
export function getAllMFO(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/spms/getAllMFO'
    })
}
export function addMFO(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/spms/addMFO'
    })
}