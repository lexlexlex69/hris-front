import axios from 'axios';

export function verifyPaySlipInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/payslip/verifyPaySlipInfo'
    })
}