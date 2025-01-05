import axios from 'axios'

export function employeesRequest()
{
    return axios.request({
        method: 'GET',
        url: '/api/profile/employees',
    })
}
