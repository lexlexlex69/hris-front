import axios from 'axios'

export function pdsEligibilityRequest(id){
    return axios.request({
        method:'POST',
        url: '/api/pds/getEmployeeEligibility',
        data: {
            id: id
        }
    })
}