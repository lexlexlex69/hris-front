import axios from "axios";
import { api_url } from "../../../../../request/APIRequestURL";

export function getEmpList(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/getEmpList'
    })
}
export function getEarnTable(){
    return axios.request({
        method:'GET',
        // data:data,
        url:'api/earnleave/getEarnTable'
    })
}
export function getWorkSchedule(){
    return axios.request({
        method:'GET',
        // data:data,
        url:'api/earnleave/getWorkSchedule'
    })
}
export function postEarnLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/postEarnLeave'
    })
}
export function getDailyEarnLeaveDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/getDailyEarnLeaveDetails'
    })
}
export function postDailyEarnLeaveDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/postDailyEarnLeaveDetails'
    })
}
export function getAllDailyEarnLeaveDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/getAllDailyEarnLeaveDetails'
    })
}
export function getDTRAPIForDailyEarn(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/getDTRAPIForDailyEarn'
       
    })
}
// export function getDTRAPIForDailyEarn(data){
//     return axios.request({
//         method:'GET',
//         headers:{
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': '*',
//             // 'Access-Control-Allow-Credentials':false,
//             'Content-Type': 'application/json'
//         },
//         // url:'api/DTR/getDTR'procempDtr
//         // url:'http://localhost/Butuan/HRIS/api/procempDtr/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
//         // url:'http://localhost/Butuan/HRIS/api/getempDtr2/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
//         url:api_url+'/getempDtr2/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
//         // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getempDtr/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
//         // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getDtr/2020-02-20/2020-02-20/b9e1f8a0553623f1:639a3e:17f68ea536b'
//     })
// }
// export function processEmpList(data){
//     return axios.request({
//         method:'POST',
//         data:data,
//         url:'api/earnleave/getEmpList'
//     })
// }
export function getDTRAPIForEarnLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:api_url+'/getEmpDTRForEarnLeave'
    })
}
export function getDailyEarnedLeaveRequest(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/getDailyEarnedLeaveRequest'
    })
}
export function approvedEarnedLeaveRequest(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/approvedEarnedLeaveRequest'
    })
}
export function viewDTR(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/viewDTR'
    })
}
export function submitDisapprovedRequest(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/earnleave/submitDisapprovedRequest'
    })
}