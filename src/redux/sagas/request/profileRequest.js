import axios from 'axios'

// export function profileRequest(id)
// {
//     return axios.request({
//         method: 'POST',
//         url: '/api/userprofile/getUserProfile',
//         data: {
//             id: id
//         }
//     })
// }
export function profileRequest()
{
    return axios.request({
        method: 'GET',
        url: '/api/userprofile/getUserProfile',
    })
}
export function profileUpdateRequest(profile)
{
    return axios.request({
        method: 'POST',
        url: '/api/userprofile/profileUpdate',
        data: profile
    })
}