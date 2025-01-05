import axios from 'axios';

export function postRegionName(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/test/postRegionName'
    })
}