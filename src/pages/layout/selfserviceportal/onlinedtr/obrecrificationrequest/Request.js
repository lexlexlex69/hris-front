import axios from "axios";
import { api_url } from "../../../../../request/APIRequestURL";

export function getDTREmplist(){
    return axios.request({
        method:'POST',
        url:'api/DTR/getDTREmplist'
    })
}
export function getRequestedOBRectification(){
    return axios.request({
        method:'POST',
        url:'api/DTR/getRequestedOBRectification'
    })
}
// export function checkDTRExistAPI(data){
//     return axios.request({
//         method:'POST',
//         data:data,
//         url:api_url+'/checkDTRExistAPI'
//     })
// }
export function checkDTRExistAPI(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/DTR/checkDTRExistAPI'
    })
}