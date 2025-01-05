import axios from "axios";

export function saveUserInformation(data) {
    return axios.get('/sanctum/csrf-cookie').then(response => {
        return axios.request({
            method: 'POST',
            url: '/api/userRegistration',
            data: {
                data: data
            }
        })
    })

}
export function resendVerificationCode(data) {
    return axios.get('/sanctum/csrf-cookie').then(response => {
        return axios.request({
            method: 'POST',
            url: '/api/resendVerificationCode',
            data: {
                data: data
            }
        })
    })

}
export function resendVerificationCodeOnLoad(data) {
    return axios.get('/sanctum/csrf-cookie').then(response => {
        return axios.request({
            method: 'POST',
            url: '/api/resendVerificationCodeOnLoad',
            data: {
                data: data
            }
        })
    })

}
export function verifyUserAccount(data) {
    return axios.request({
        method: 'POST',
        url: '/api/verifyUserAccount',
        data: {
            data: data
        }
    })
}
export function verifyUserAccountOnLoad(code) {
    return axios.request({
        method: 'POST',
        url: '/api/verifyUserAccountOnLoad',
        data: {
            data: code
        }
    })
}
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