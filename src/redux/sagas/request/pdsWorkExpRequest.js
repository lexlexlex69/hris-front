import axios from 'axios'

export function pdsWorkExpRequest(id)
{
    return axios.request({
        method: 'POST',
        url:'/api/pds/getEmployeeWorkExp',
        data: {
            id:id
        }
    })
}