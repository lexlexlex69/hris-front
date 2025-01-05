import axios from "axios";

export function impersonateLogin(data){
    return axios.get('/sanctum/csrf-cookie').then(response => {
       return axios.request({
            method: 'POST',
            url: '/api/impersonateLogin',
            data: data
        })
    });
}