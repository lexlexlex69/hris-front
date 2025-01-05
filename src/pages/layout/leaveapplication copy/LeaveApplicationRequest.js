import axios from "axios";
import { api_url } from "../../../request/APIRequestURL";
export function getTypesOfLeave(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getTypesOfLeave'
    })
}
export function getEmployeeInfo(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getEmployeeInfo'
    })
}
export function getLeaveDetails(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/leaveapplication/getLeaveDetails'
    })
}
export function getLeaveApplicationData(id){
    return axios.request({
        method:'GET',
        data:{
            data:id
        },
        url:'api/leaveapplication/getLeaveApplicationData'
    })
}
export function refreshData(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/refreshData'
    })
}
export function cancelLeaveApplication(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/leaveapplication/cancelLeaveApplication'
    })
}
export function addLeaveApplication(data){
    // var url = 'api/leaveapplication/addLeaveApplication';
    // var data = fd;
    // return axios.post(url,data);
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/leaveapplication/addLeaveApplication'
    })
}
export function getVerifyLeaveApplicationData(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getVerifyLeaveApplicationData'
    })
}
export function getRecommendationLeaveApplicationData(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getRecommendationLeaveApplicationData'
    })
}
export function getApprovalLeaveApplicationData(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getApprovalLeaveApplicationData'
    })
}
export function getFilterVerifyLeaveApplicationData(name){
    return axios.request({
        method:'POST',
        data: {
            data:name
        },
        url:'api/leaveapplication/getFilterVerifyLeaveApplicationData'
    })
}
export function getFilterRecommendationLeaveApplicationData(name){
    return axios.request({
        method:'POST',
        data: {
            data:name
        },
        url:'api/leaveapplication/getFilterRecommendationLeaveApplicationData'
    })
}
export function getFilterApprovalLeaveApplicationData(name){
    return axios.request({
        method:'POST',
        data: {
            data:name
        },
        url:'api/leaveapplication/getFilterApprovalLeaveApplicationData'
    })
}
export function submitLeaveApplicationReview(data){
    return axios.request({
        method:'POST',
        data: {
            data:data
        },
        url:'api/leaveapplication/submitLeaveApplicationReview'
    })
}
export function submitLeaveApplicationRecommendation(data){
    return axios.request({
        method:'POST',
        data: {
            data:data
        },
        url:'api/leaveapplication/submitLeaveApplicationRecommendation'
    })
}
export function submitLeaveApplicationApproval(data){
    return axios.request({
        method:'POST',
        data: {
            data:data
        },
        url:'api/leaveapplication/submitLeaveApplicationApproval'
    })
}
export function getMonetizationInfo(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getMonetizationInfo'
    })
}
export function getLastDayOfDuty(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getLastDayOfDuty'
    })
}
export function getMaternityAllocationInfo(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/leaveapplication/getMaternityAllocationInfo'
    })
}
export function getCTOAlreadyAppliedHours(month_year){
    return axios.request({
        method:'POST',
        data:{
            data:month_year
        },
        url:'api/leaveapplication/getCTOAlreadyAppliedHours'
    })
}
export function getLeaveBalance(id){
    return axios.request({
        method:'GET',
        // url:'https://test.butuan.gov.ph/hris-api/api/getLeaveBal/'+id+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:'http://localhost/Butuan/HRIS/api/getLeaveBal/'+id+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
        url:api_url+'/getLeaveBal/'+id+'/b9e1f8a0553623f1:639a3e:17f68ea536b'
    })
}
export function updateLeaveBalance(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/leaveapplication/updateLeaveBalance'
    })
}
export function isBalanceUpdatedToday(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/isBalanceUpdatedToday'
    })
}
export function getLeaveLedger(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/leaveapplication/getLeaveLedger'
    })
}
export function getWorkSchedule(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getWorkSchedule'
    })
}
export function postReviewApplicLeaveAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/postReviewApplicLeaveAPI'
        // url:'https://test.butuan.gov.ph/hris-api/api/postReviewApplicLeaveAPI'
        url:api_url+'/postReviewApplicLeaveAPI'
    })
}
export function postApprovedApplicLeaveAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/postApprovedApplicLeaveAPI'
        // url:'https://test.butuan.gov.ph/hris-api/api/postApprovedApplicLeaveAPI'
        url:api_url+'/postApprovedApplicLeaveAPI'

    })
}
export function postApprovalApplicLeaveAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/postApprovalApplicLeaveAPI'
        // url:'https://test.butuan.gov.ph/hris-api/api/postApprovalApplicLeaveAPI'
        url:api_url+'/postApprovalApplicLeaveAPI'
    })
}
export function postDisApprovalApplicLeaveAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/postDisApprovalApplicLeaveAPI'
        // url:'https://test.butuan.gov.ph/hris-api/api/postDisApprovalApplicLeaveAPI'
        url:api_url+'/postDisApprovalApplicLeaveAPI'
    })
}
export function getApplicLeaveRecords(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/getApplicLeaveRecords'
        // url:'https://test.butuan.gov.ph/hris-api/api/getApplicLeaveRecords'
        url:api_url+'/getApplicLeaveRecords'

    })
}
export function getAllApprovedLeave(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getAllApprovedLeave'

    })
}
export function recallLeaveApplication(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/recallLeaveApplication'
    })
}
export function recallLeaveApplicationAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        url:api_url+'/recallLeaveApplicationAPI'
    })
}
export function updateCTOLeaveDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/updateCTOLeaveDetails'
    })
}
export function getCTOLeaveDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getCTOLeaveDetails'
    })
}
export function postCTOVerification(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/postCTOVerification'
    })
}
export function deleteCTOApplication(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/deleteCTOApplication'
    })
}
export function getSPLBal(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getSPLBal'
    })
}