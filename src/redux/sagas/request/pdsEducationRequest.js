import axios from 'axios'

export function pdsEducationRequest(id)
{
    return axios.request({
        method: 'POST',
        url: '/api/pds/getEmployeeEducation',
        data: {
            id: id
        }
    })
}