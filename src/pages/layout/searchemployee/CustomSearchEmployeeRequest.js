import axios from "axios";

export function searchEmployee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/employee/searchEmployee'
    })
}
