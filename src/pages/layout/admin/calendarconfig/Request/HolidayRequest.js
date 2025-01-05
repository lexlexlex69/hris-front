import axios from "axios";


export function getAllHolidays() {
    return axios.request({
        method: 'GET',
        url: '/api/holiday/getAllHolidays',
    })
}
export function deleteHoliday(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: '/api/holiday/deleteHoliday',
    })
}
export function addHoliday(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: '/api/holiday/addHoliday',
    })
}
export function updateHoliday(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: '/api/holiday/updateHoliday',
    })
}