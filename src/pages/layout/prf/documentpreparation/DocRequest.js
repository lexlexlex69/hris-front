import axios from "axios";


export async function uploadLetterhead(data) {
    try {
        const response = await axios.request({
            method: 'POST',
            data: data,
            url: 'api/document-process/upload-letterhead'
        })
        return response
    } catch (error) {
        return error
    }
}

export function getUploadedLetterhead(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-process/get-uploaded-letterhead'
    })
}

export function getPrfSignatories(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-process/get-prf-signatories'
    })
}
// export function getPrfSignatories2(data) {
//     return axios.request({
//         method: 'post',
//         data: data,
//         url: 'api/document-process/get-document-signatories'
//     })
// }


export function getEquivalentSGValue(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/prf/get-equivalent-sg-value'
    })
}

export function getEquivalentSGValueByStep(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/prf/get-equivalent-sg-value-by-step'
    })
}

// export function insertAppointmentDate(data) {
//     return axios.request({
//         method: 'post',
//         data: data,
//         url: 'api/document-process/insert-appointment-date',
//     })
// }

export function sendRequirement(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/prf/document-process/send-requirement'
    })
}

export function setAppointmentDate(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-process/set-appointment-date',
    })
}

export function insertUpdateRequirement(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-process/insert-update-requirement',
    })
}

export function setSelectedRaterAssessment(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/prf/document-process/set-selected-rater-assessment',
    })
}

export function getSelectedApplicant(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/prf/get-selected-applicant'
    })
}

export function addJobDescription(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-process/add-job-description',
    })
}

export function addJobTerms(data) {
    return axios.request({
        method: 'post',
        data: data,
        url: 'api/document-process/add-job-terms',
    })
}