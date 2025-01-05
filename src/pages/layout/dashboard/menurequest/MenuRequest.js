import axios from "axios";

export function getUserMenus(){
    return axios.request({
        method:'POST',
        url:'/api/getUserMenus'
    })
    
}