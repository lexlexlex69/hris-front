import axios from "axios";

export function auditLogs(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/auditLogs'
    })
}