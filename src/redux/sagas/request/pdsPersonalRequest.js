import axios from 'axios'

export function pdsPersonalRequest(id)
{
    return axios.request({
        method: 'POST',
        url: '/api/pds/getEmployeePersonal',
        data: {
            id: id
        }
    })
}

export function pdsPersonalUpdate(id,personalInfo)
{
    return axios.request({
        method: 'POST',
        url: '/api/pds/employeePersonalUpdate',
        data: {
            id: id,
            personalInfo:personalInfo
        }
    })
}

export function getPdsPersonalWithUpdateRequest(id)
{
    return axios.request({
        method: 'POST',
        url: '/api/pds/employeePersonalwithUpdate',
        data: {
            id: id,
        }
    })
}