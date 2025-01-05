import axios from 'axios'

export function logoutRequest() {
    return axios.request({
        method: 'GET',
        url: '/api/hrisLogout'
    })

}