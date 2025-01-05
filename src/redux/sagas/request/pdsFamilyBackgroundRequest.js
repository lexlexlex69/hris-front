import axios from 'axios'

export function pdsFamilyBackgroundRequest(id)
{
    return axios.request({
        method: 'POST',
        url: '/api/pds/getEmployeeFamily',
        data: {
            id: id
        }
    })
}