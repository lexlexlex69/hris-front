import axios from "axios";
import { api_url } from "../../../request/APIRequestURL";
import { data } from "jquery";
export function getWorkScheduleTemplate(){
    return axios.request({
        method:'GET',
        url:'api/workschedule/getWorkScheduleTemplate'
    })
}

export function getWorkSchedule(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/getWorkingHrs/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:'https://test.butuan.gov.ph/Butuan/HRIS/api/getWorkingHrs/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:'https://test.butuan.gov.ph/joe_test_api/HRIS/api/getWorkingHrs/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // url:api_url+'/getWorkingHrs/b9e1f8a0553623f1:639a3e:17f68ea536b'
    })
}
export function addWorkScheduleTemplate(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/addWorkScheduleTemplate'
    })
}
export function getOffices(){
    return axios.request({
        method:'GET',
        url:'api/offices/getOffices'
    })
}
export function getEmpStatus(){
    return axios.request({
        method:'GET',
        url:'api/workschedule/getEmpStatus'
    })
}
export function searchFilter(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/searchFilter'
    })
}
export function searchDepartmentFilter(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/searchDepartmentFilter'
    })
}
export function showTemplateEmployeeList(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/showTemplateEmployeeList'
    })
}
export function searchFilterUpdate(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/searchFilterUpdate'
    })
}
export function addEmployeeWorkSched(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/addEmployeeWorkSched'
    })
}
export function getScheduleData(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/getScheduleData'
    })
}
export function deleteScheduleData(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/deleteScheduleData'
    })
}
export function getEmpScheduleData(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/getEmpScheduleData'
    })
}
export function updateEmpScheduleData(data){
    // return axios.post('/api/workschedule/updateEmpScheduleData',data);
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/updateEmpScheduleData'
    })
}
export function removeEmpScheduleData(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/removeEmpScheduleData'
    })
}
export function deleteEmpScheduleData(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/deleteEmpScheduleData'
    })
}
export function deleteMultipleEmpScheduleData(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/deleteMultipleEmpScheduleData'
    })
}
export function addMultipleWorkSched(data){
    return axios.request({
        method:'POST',
        // headers:{
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': '*',
        //     'Access-Control-Allow-Credentials':false,
        //     'Content-Type': 'application/json'
        // },
        data:{
            data:data
        },
        url:'api/workschedule/addMultipleWorkSched'
    })
}
export function addMultipleWorkSchedFinal(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/addMultipleWorkSchedFinal'
    })
}
export function deleteTemplate(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/deleteTemplate'
    })
}
export function updateTemplate(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/workschedule/updateTemplate'
    })
}
export function postWorkSchedAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:'http://localhost/Butuan/HRIS/api/postWorkSchedAPI'
        // url:api_url+'/postWorkSchedAPI'
        url:'api/workschedule/postWorkSchedAPI'
    })
}
export function updateRequestedWorkSchedAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        // url:api_url+'/updateRequestedWorkSchedAPI'
        url:'api/workschedule/updateRequestedWorkSchedAPI'
    })
}
export function getAddedWorkSched(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/getAddedWorkSched'
    })
}
export function approvedAddedWorkSched(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/approvedAddedWorkSched'
    })
}
export function disapprovedRequestedUpdateWorkSched(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/disapprovedRequestedUpdateWorkSched'
    })
}
export function getRequestedDelWorkSched(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/getRequestedDelWorkSched'
    })
}
export function getRequestedUpdateWorkSched(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/getRequestedUpdateWorkSched'
    })
}
export function deleteRequestedDelWorkSched(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/deleteRequestedDelWorkSched'
    })
}
export function deleteMultipleRequestedDelWorkSched(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/deleteMultipleRequestedDelWorkSched'
    })
}
export function disapprovedNewlyAddedWorkSched(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/disapprovedNewlyAddedWorkSched'
    })
}
export function getApproverType(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/workschedule/getApproverType'
    })
}
