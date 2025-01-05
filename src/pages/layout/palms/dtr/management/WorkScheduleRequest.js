import axios from "axios";

export function getWorkScheduleTemplate() {
    return axios.request({
        method: 'GET',
        url: 'api/workschedule/getScheduleData'
    })
}

export function getScheduleData(data) {
    return axios.request({
        method: 'POST',
        data: {
            data: data
        },
        url: 'api/workschedule/getScheduleData'
    })
}

// get work schedule getting of work schedule
export function getWorkScheduleAPI(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/workschedule/getWorkScheduleAPI'
    })
}

export function getWorkSched(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/DTR/getWorkSched'
    })
}

export function updateDTRSchedule(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/DTR/updateDTRSchedule',
    })
}

export function getHolidaySchedule(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/DTR/getHolidaySchedule',
    })
}

export function upsertWorkSched(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/DTR/upsertWorkSched',
    })
}
export function getDepartmentDTRTemplates(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/DTR/getDepartmentDTRTemplates',
    })
}
export function getEmpStatus() {
    return axios.request({
        method: 'GET',
        url: 'api/DTR/getEmpStatus',
    })
}
export function postDTRSchedule(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/DTR/postDTRSchedule',
    })
}