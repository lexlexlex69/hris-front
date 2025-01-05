import axios from 'axios'

export function pdsOthersRequest(id)
{
    return axios.request({
        method:'POST',
        url: 'api/pds/getEmployeeOthers',
        data: {
            id: id
        }
    })
}

export function pdsOthersChecklistRequest(id)
{
    return axios.request({
        method: 'POST',
        url: 'api/pds/getEmployeeOthersChecklist',
        data: {
            id:id
        }
    })
}