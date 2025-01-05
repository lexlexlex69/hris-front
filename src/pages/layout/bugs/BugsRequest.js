import axios from "axios";

export function getAllBugsData(data){
    return axios.request({
        method:'GET',
        url:'api/bugs/getAllBugsData'
    })
} 
export function addBugs(data){
    return axios.request({
        method:'POST',
        data:{
            data:data
        },
        url:'api/bugs/addBugs'
    })
} 