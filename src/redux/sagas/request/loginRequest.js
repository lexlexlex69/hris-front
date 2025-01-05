import axios from 'axios'

export function loginRequest(username, password) {
    return axios.get('/sanctum/csrf-cookie').then(response => {
       return axios.request({
            method: 'POST',
            url: '/api/hrisLogin',
            data: {
                username: username,
                password: password
            }
        })
    });

}