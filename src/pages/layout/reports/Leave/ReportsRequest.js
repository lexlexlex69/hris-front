import axios from 'axios';

export function getLeaveRep(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/reports/getLeaveRep'
    })
}
export function getLeaveRepDetails(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/reports/getLeaveRepDetails'
    })
}