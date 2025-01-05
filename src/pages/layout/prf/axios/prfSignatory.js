import axios from "axios";


export function updateInsertSignatory(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-signatory/update-insert-signatory'
    })
}

export function getAllSignatory(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-signatory/get-all'
    })
}

export function getSpecificSignatory(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-signatory/get-specific-signatory'
    })
}