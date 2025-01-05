import axios from "axios";

export function getApplicantPdsEducBackground(data){
    return axios.request({
        method:'GET',
        url:'/api/applicantpds/getApplicantPdsEducBackground',
        data:{
            data:data
        }
    })
    
}