import axios from "axios";
export function getMetaTagsData(){
    return axios.request({
        method:'GET',
        url:'api/metatags/getMetaTagsData'
    })
}
export function addMetaTags(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/metatags/addMetaTags'
    })
}
export function deleteMetaTags(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/metatags/deleteMetaTags'
    })
}
export function updateMetaTags(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/metatags/updateMetaTags'
    })
}