import axios from "axios";

export function getAllForReviewPassSlip(){
    return axios.request({
        method:'GET',
        url:'api/passslip/getAllForReviewPassSlip'
    })
}
export function getAllForApprovalPassSlip(){
    return axios.request({
        method:'GET',
        url:'api/passslip/getAllForApprovalPassSlip'
    })
}
export function getAllPassSlipData(data){
    return axios.request({
        method:'GET',
        url:'api/passslip/getAllPassSlipData'
    })
}
export function getAllUndertimePermitData(data){
    return axios.request({
        method:'GET',
        url:'api/undertimepermit/getAllUndertimePermitData'
    })
}
export function addPassSlip(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/passslip/addPassSlip'
    })
}
export function addUndertimePermit(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/undertimepermit/addUndertimePermit'
    })
}
export function reviewActionPassSlip(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/passslip/reviewActionPassSlip'
    })
}
export function approvalActionPassSlip(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/passslip/approvalActionPassSlip'
    })
}
export function deletePassSlip(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/passslip/deletePassSlip'
    })
}
export function deleteUndertimePermit(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/undertimepermit/deleteUndertimePermit'
    })
}
export function scanPassSlip(id){
    return axios.request({
        method:'POST',
        data:{
            data:id
        },
        url:'api/passslip/scanPassSlip'
    })
}