import axios from 'axios'

export function applicantpdsPersonalRequest(id){
    return axios.request({
        method:'POST',
        url:'/api/getApplicantPdsPersonal',
        data:{
            id:id
        }
    })
}