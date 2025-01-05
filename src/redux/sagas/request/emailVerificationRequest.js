import axios from 'axios'

export function sendEmailVerificationRequest(email){
    return axios.request({
        method:'POST',
        url:'/api/sendEmailVerification',
        data:{
            email:email
        }
    })
}