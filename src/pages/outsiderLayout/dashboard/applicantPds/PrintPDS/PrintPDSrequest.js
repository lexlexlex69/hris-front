import axios from "axios";

const pdsURL = {
    url1:   '/api/recruitment/applicant/pds/PersonalInfo/getPersonalInfoPersonalAddAddress',
    url2:   '/api/recruitment/applicant/pds/Education/getFamilyBackground',
    url3:   '/api/recruitment/applicant/pds/Children/getChildren',
    url4:   '/api/recruitment/applicant/pds/Education/getEducation',
    url5:   '/api/recruitment/applicant/pds/Eligibility/getEligibility',
    url6:   '/api/recruitment/applicant/pds/Trainings/getTrainings',
    url7:   '/api/recruitment/applicant/pds/voluntary/getVoluntary',
    url8:   '/api/recruitment/applicant/pds/references/getReferences',
    url9:   '/api/recruitment/applicant/pds/SkillsHobbies/getSkillsHobbies',
    url10:  '/api/recruitment/applicant/pds/WorkExp/getWorkExp',
    url11:  '/api/recruitment/applicant/pds/govid/getGovid',
}

export function getPersonalInfoPersonalAddAddress() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url1
    })
}

export function getFamilyBackground() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url2
    })
}

export function getChildren() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url3
    })
}

export function getEducation() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url4
    })
}

export function getEligibility() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url5
    })
}

export function getTrainings() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url6
    })
}

export function getVoluntary() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url7
    })
}

export function getWorkExp() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url8
    })
}

export function getSkillsHobbies() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url9
    })
}

export function getReferences() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url10
    })
}

export function getGovid() {
    return axios.request({
        method: 'GET',
        url: pdsURL.url11
    })
}
