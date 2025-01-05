import axios from 'axios'

export function employeeRequest(emp_id)
{
    return axios.request({
        method: 'POST',
        url: '/api/profile/employee',
        data: {
            id: emp_id
        }
    })
}

export function employeeUpdateRequest(employee)
{
    return axios.request({
        method: 'POST',
        url: '/api/profile/employeeUpdate',
        data: employee
    })
}