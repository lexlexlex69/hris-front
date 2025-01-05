import axios from 'axios'

export function pdsVoluntartyRequest(id)
{
    return axios.request({
            method: 'POST',
            url: '/api/pds/getEmployeeVoluntary',
            data: {
                id:id
            }
        })
}