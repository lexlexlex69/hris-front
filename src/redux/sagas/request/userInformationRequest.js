import axios from 'axios'

export function userInformationRequest(id)
{
    return axios.request({
        method: 'get',
        url: '/api/getUserInformation',
        data: {
            id: id
        }
    })
}
export function userPDSRequest()
{
    return axios.request({
        method: 'get',
        url: '/api/getHasUserPDS',
    })
}
export function updateUserPasswordRequest(data)
{
    return axios.request({
        method: 'post',
        url: '/api/updateUserPassword',
        data:{
            data:data
        }
    })
}