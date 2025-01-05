import axios from 'axios';
import { api_url } from '../../../../../request/APIRequestURL';

export function getHRForApproval(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/getHRForApproval'
    })
}
export function approvedHRReview(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/approvedHRReview'
    })
}
export function submitHRApprovalForUpdatingReviewAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:api_url+'/submitHRApprovalForUpdatingReviewAPI'
        url:'api/leaveapplication/submitHRApprovalForUpdatingReviewAPI'
    })
}
export function submitHRApprovalForUpdatingReview(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/submitHRApprovalForUpdatingReview'
    })
}
export function submitLeaveApplicationUpdateCTO(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/submitLeaveApplicationUpdateCTO'
    })
}
export function submitLeaveReconciliation(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/submitLeaveReconciliation'
    })
}
export function submitLeaveDisapproval(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/submitLeaveDisapproval'
    })
}
export function submitLeaveBackToReview(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/leaveapplication/submitLeaveBackToReview'
    })
}