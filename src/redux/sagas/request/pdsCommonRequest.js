import axios from 'axios'

export function confirmPdsPersonalInfo(data)
{
    return axios.request({
        method:'POST',
        url:'api/pds/employeePersonalConfirmUpdate',
        data: data
    })
}

export function confirmPdsAddress(data)
{
    return axios.request({
        method:'POST',
        url:'api/pds/employeeAddressConfirmUpdate',
        data: data
    })
}