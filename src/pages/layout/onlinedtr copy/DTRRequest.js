import axios from "axios";
import { api_url } from "../../../request/APIRequestURL";
export function getDTR(data){
    return axios.request({
        method:'POST',
        data:data,
        // headers:{
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': '*',
        //     // 'Access-Control-Allow-Credentials':false,
        //     'Content-Type': 'application/json'
        // },
        url:'api/DTR/getDTR'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getempDtr/10426/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getDtr/2020-02-20/2020-02-20/b9e1f8a0553623f1:639a3e:17f68ea536b'
    })
}
export function getDTRAPI(data){
    return axios.request({
        method:'GET',
        headers:{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            // 'Access-Control-Allow-Credentials':false,
            'Content-Type': 'application/json'
        },
        // url:'api/DTR/getDTR'procempDtr
        // url:'http://localhost/Butuan/HRIS/api/procempDtr/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:'http://localhost/Butuan/HRIS/api/getempDtr2/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
        url:api_url+'/getempDtr2/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getempDtr/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getDtr/2020-02-20/2020-02-20/b9e1f8a0553623f1:639a3e:17f68ea536b'
    })
}
export function getEmployeeInfo(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getEmployeeInfo'
    })
}
export function addRectificationRequest(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/DTR/addRectificationRequest'
    })
}
export function getRectificationRequestData(data){
    return axios.request({
        method:'GET',
        url:'api/DTR/getRectificationRequestData'
    })
}
export function cancelRectificationRequest(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/DTR/cancelRectificationRequest'
    })
}
export function getRectificationRequestReviewData(){
    return axios.request({
        method:'GET',
        url:'api/DTR/getRectificationRequestReviewData'
    })
}
export function approvedReviewRectificationRequest(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/DTR/approvedReviewRectificationRequest'
    })
}
export function disapprovedReviewRectificationRequest(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/DTR/disapprovedReviewRectificationRequest'
    })
}
export function getRectificationRequestApprovalData(){
    return axios.request({
        method:'GET',
        url:'api/DTR/getRectificationRequestApprovalData'
    })
}
export function approvalRectificationRequest(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/DTR/approvalRectificationRequest'
    })
}
export function disapprovalRectificationRequest(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/DTR/disapprovalRectificationRequest'
    })
}
export function insertDTR(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/DTR/insertDTR'
    })
}
export function getLogAdjustmentData(){
    return axios.request({
        method:'GET',
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getAdjType/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:'https://test.butuan.gov.ph/hris-api/api/getAdjType/b9e1f8a0553623f1:639a3e:17f68ea536b'
        url:api_url+'/getAdjType/b9e1f8a0553623f1:639a3e:17f68ea536b'
    })
}
export function getRectificationRequestPeriod(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/DTR/getRectificationRequestPeriod'
    })
}
export function getApprovedRectificationRequest(data){
    return axios.request({
        method:'GET',
        url:'api/DTR/getApprovedRectificationRequest'
    })
}
export function postAPIDTRRectification(data){
    // return axios.post('/https://test.butuan.gov.ph/joe_test_api/HRIS/api/procDTRRectNew2',data);
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/procDTRRectNew2'
        // url:'https://test.butuan.gov.ph/hris-api/api/procDTRRectNew2'
        url:api_url+'/procDTRRectNew2'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/procDTRRectNew2'
    })
}
export function postDTRRectification(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/DTR/postDTRRectification'
    })
}
export function getOfficeHeadName(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/DTR/getOfficeHeadName'
    })
}
export function getOffices(){
    return axios.request({
        method:'GET',
        url:'api/offices/getOffices'
    })
}
export function getOBDetail(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/getOBDetail'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getOBDetail'
        // url:'https://test.butuan.gov.ph/hris-api/api/getOBDetail'
        url:api_url+'/getOBDetail'
    })
}
export function getOfficeEmployee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/DTR/getOfficeEmployee'
    })
}

export function getEmployeeSchedule(data){
    return axios.request({
        method:'POST',
        data:{
            data
        },
        url:'api/DTR/getEmployeeSchedule'
    })
}
export function postOBRectification(data){
    return axios.request({
        method:'POST',
        data:{
            data
        },
        url:'api/DTR/postOBRectification'
    })
}
export function postOBScheduleAPI(data){
    return axios.request({
        method:'POST',
        data:{
            data
        },
        // url:'http://localhost/Butuan/HRIS/api/postOBRectification'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/postOBRectification'
        // url:'https://test.butuan.gov.ph/hris-api/api/postOBRectification'
        url:api_url+'/postOBRectification'
    })
}
export function getOBRectificationDetail(data){
    return axios.request({
        method:'POST',
        data:{
            data
        },
        url:'api/DTR/getOBRectificationDetail'
    })
}
export function updateOBInserted(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/DTR/updateOBInserted'
    })
}
export function deleteOBScheduleAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/deleteOBScheduleAPI'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/postOBRectification'
        url:api_url+'/deleteOBScheduleAPI'
    })
}
export function deleteOBInserted(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/DTR/deleteOBInserted'
    })
}
export function checkMaximumMissedLogs(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/DTR/checkMaximumMissedLogs'
    })
}