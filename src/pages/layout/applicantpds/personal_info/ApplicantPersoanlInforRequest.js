import axios from "axios";

export function getApplicantPdsPersonal(data){
    return axios.request({
        method:'GET',
        url:'/api/applicantpds/getApplicantPdsPersonal',
        data:{
            data:data
        }
    })
    
}
export function updateApplicantPdsPersonal(data){
    return axios.request({
        method:'POST',
        url:'/api/applicantpds/updateApplicantPdsPersonal',
        data:{
            data:data
        }
    })
    
}