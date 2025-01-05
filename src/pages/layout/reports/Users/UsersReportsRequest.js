import axios from "axios";

export function usersReports(){
    return axios.request({
        method:'POST',
        url:'api/reports/usersReports'
    })
}
export function getLackingPDSInfo(){
    return axios.request({
        method:'POST',
        url:'api/reports/getLackingPDSInfo'
    })
}