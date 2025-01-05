import axios from "axios";

export function getTrainingReports(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/reports/getTrainingReports'
    })
}