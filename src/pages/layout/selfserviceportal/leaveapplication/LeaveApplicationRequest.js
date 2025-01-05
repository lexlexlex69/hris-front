import axios from "axios";
import { api_url } from "../../../../request/APIRequestURL";
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
export function getCurrentMonthCOC(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getCurrentMonthCOC'
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
export function getEmpLeaveBalance(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getEmpLeaveBalance'
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
export function getAllHolidays(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getAllHolidays'
    })
}
export function getHolidays(){
    return axios.request({
        method:'POST',
        url:api_url+'/getHolidays'
    })
}
export function postReviewEmpApplicLeaveAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/postReviewEmpApplicLeaveAPI'
    })
}
export function postReviewApplicLeaveAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/postReviewApplicLeaveAPI'
        // url:api_url+'/postReviewApplicLeaveAPI'
    })
}
export function postUpdatingReviewApplicLeaveAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:api_url+'/postUpdatingReviewApplicLeaveAPI'
        url:'api/leaveapplication/postUpdatingReviewApplicLeaveAPI'
    })
}
export function postSLLateFiling(data){
    return axios.request({
        method:'POST',
        data:data,
        url:api_url+'/postSLLateFiling'
    })
}
export function submitLeaveApplicationLateFilingReview(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/submitLeaveApplicationLateFilingReview'
    })
}
export function postApprovedApplicLeaveAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/postApprovedApplicLeaveAPI'
        // url:'http://localhost/Butuan/HRIS/api/postApprovedApplicLeaveAPI'
        // url:'https://test.butuan.gov.ph/hris-api/api/postApprovedApplicLeaveAPI'
        // url:api_url+'/postApprovedApplicLeaveAPI'

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
export function getEmpApplicLeaveRecords(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getEmpApplicLeaveRecords'

    })
}
export function recomputeEmpApplicLeaveRecords(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/recomputeEmpApplicLeaveRecords'

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
export function verifyMaternityBeneficiary(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/verifyMaternityBeneficiary'
    })
}
export function getFiledExtendedMaternityLeave(){
    return axios.request({
        method:'GET',
        url:'api/leaveapplication/getFiledExtendedMaternityLeave'
    })
}
export function getFilteredFiledExtendedMaternityLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getFilteredFiledExtendedMaternityLeave'
    })
}
export function addExtendedMaternityBeneficiaryInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/addExtendedMaternityBeneficiaryInfo'
    })
}
export function getExtendedMaternityInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getExtendedMaternityInfo'
    })
}
export function verifyExtendedMaternityInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/verifyExtendedMaternityInfo'
    })
}
export function getOffices(){
    return axios.request({
        method:'POST',
        url:'api/leaveapplication/getOffices'
    })
}
export function getOfficesLeaveDtl(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getOfficesLeaveDtl'
    })
}
export function executeForfeiture(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/executeForfeiture'
    })
}
export function searchEmployee(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/employee/searchEmployee'
    })
}
export function addFromOutsiderMaternityAllocation(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/addFromOutsiderMaternityAllocation'
    })
}
export function getOutsiderBeneficiaryData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getOutsiderBeneficiaryData'
    })
}
export function getRequestedEarnedLeaveInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getRequestedEarnedLeaveInfo'
    })
}
export function submitRequestedEarnedLeave(data,config){
    return axios.request({
        method:'POST',
        data:data,
        config:config,
        url:'api/leaveapplication/submitRequestedEarnedLeave'
    })
}
export function getDTRAPIForDailyEarn2(data,config){
    return axios.request({
        method:'GET',
        headers:{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            // 'Access-Control-Allow-Credentials':false,
            'Content-Type': 'application/json'
        },
        url:api_url+'/getempDtr2/'+data.emp_id+'/'+data.from+'/'+data.to+'/b9e1f8a0553623f1:639a3e:17f68ea536b',
        config
    })
}
export function getEarnTable2(config){
    return axios.request({
        method:'GET',
        // data:data,
        url:'api/earnleave/getEarnTable',
        config
    })
}
export function searchCancelApplication(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/searchCancelApplication'
    })
}
export function cancelHoliday(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/cancelHoliday'
    })
}
export function getAllTypeOfLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getAllTypeOfLeave'
    })
}
export function getAllLeaveApplication(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getAllLeaveApplication'
    })
}
export function submitLeaveApplicationUpdate(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/submitLeaveApplicationUpdate'
    })
}
export function getRemainingPaternityCredits(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getRemainingPaternityCredits'
    })
}
export function getPresentDTRDays(data){
    return axios.request({
        method:'POST',
        data:data,
        url:api_url+'/getPresentDTRDays'
    })
}
export function revertLeaveApplicationStatus(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/revertLeaveApplicationStatus'
    })
}
export function requestLeaveCancellation(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/requestLeaveCancellation'
    })
}
export function requestLeaveCancellationAction(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/requestLeaveCancellationAction'
    })
}
export function getRequestedRescheduleData(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getRequestedRescheduleData'
    })
}
export function requestRescheduleLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/requestRescheduleLeave'
    })
}
export function deleteRequestedRescheduleLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/deleteRequestedRescheduleLeave'
    })
}
export function deleteRequestedCancelledLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/deleteRequestedCancelledLeave'
    })
}
export function requestedRescheduleLeaveAction(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/requestedRescheduleLeaveAction'
    })
}
export function getCOCEarnedInfo(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getCOCEarnedInfo'
    })
}
export function computeLeaveDays(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/computeLeaveDays'
    })
}
export function getAllLeavePerDept(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getAllLeavePerDept'
    })
}
export function searchEmpLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/searchEmpLeave'
    })
}
export function cancelEmpLeave(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/cancelEmpLeave'
    })
}
export function batchLeaveApproval(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/batchLeaveApproval'
    })
}
export function updateLeaveStatus(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/updateLeaveStatus'
    })
}
export function postPrintDate(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/postPrintDate'
    })
}
export function getEmpListPerOffices(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/employee/getEmpListPerOffices'
    })
}