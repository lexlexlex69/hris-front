import axios from 'axios'

export function pdsTrainingsRequest(id)
{
    return axios.request({
        method:'POST',
        url:'/api/pds/getEmployeeTrainings',
        data: {
            id:id
        }
    })
}