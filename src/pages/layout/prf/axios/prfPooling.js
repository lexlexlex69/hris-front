import axios from "axios";

export function getAllApprovedPRAx() {
    return axios.request({
        method: "GET",
        url: "api/prf/get-all-approved-prf",
    });
}
export function getApprovedPRAx() {
    return axios.request({
        method: "GET",
        url: "api/prf/interview-assessment/get-approved-prf"
    })
}
// export function getRaterPermission(data) {
//     return axios.request({
//         method: 'POST',
//         data: data,
//         url: 'api/prf/interview-assessment/get-rater-permission'
//     })
// }



export function getSpecificDeptCode(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/personnel-request/get-user-location",
    });
}

export function getUserPerm() {
    return axios.request({
        method: "GET",
        url: "api/prf/interview-assessment/get-auth-add-question",
    });
}

export function postIAFQuestion(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/interview-assessment/add-question",
    });
}
export function getIAFCategory() {
    return axios.request({
        method: "GET",
        url: "api/prf/interview-assessment/get-all-category",
    });
}
export function getAllQuestions() {
    return axios.request({
        method: "GET",
        url: "api/prf/interview-assessment/get-all-questions",
    });
}
export function deleteQuestion(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/interview-assessment/delete_question",
    });
}

export function getIAFData(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/interview-assessment/get-all-iaf",
    });
}

export function postIAFQC(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/interview-assessment/add-update-iaf-qc",
    });
}

export function deleteIAFData(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/interview-assessment/delete-iaf",
    });
}


export function getShortList2(data, page, perPage, skip) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/pooling-applicants/get-short-list-candidates?page=${page}&perPage=${perPage}&skip=${skip}`
    })
}

export function getEmpList(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/pooling-applicants/get-dept-personnel",
    });
}


export function insertPooledApp(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/pooling-applicants"
    })
}

export function getApplicantList(id) {
    return axios.request({
        method: "GET",
        url: `api/prf/pooling-applicants/get-applicant-list/${id}`,
    })
}
export function getAssessmentList(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/interview-assessment/get-applicant-list"
    })
}


export function deleteApplicant(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/pooling-applicants/delete-pooled-applicant"
    })
}
export function reqAssessment(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/pooling-applicants/request-start-assessment"
    })
}
export function reqEndAssessment(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/prf/pooling-applicants/request-end-assessment',
    })
}




export function insertInterviewAssessment(data, id) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/interview-assessment/" + id,
    })
}
export function getInterviewAssessment(data, id) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/interview-assessment/${id}/get-applicant-result`
    })
}
export function updateInterviewAssessment(data, id) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/interview-assessment/${id}/update-applicant-result`
    })
}




export function insertExamResult(data, id) {
    return axios.request({
        method: "POST",
        data: data,
        url: "api/prf/interview-assessment/exam/" + id
    })
}
export function getExamResult(data, id) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/interview-assessment/exam/${id}/get-applicant-result`
    })
}
export function updateExamResult(data, id) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/interview-assessment/exam/${id}/update-applicant-result`,
    })
}




export function insertBIAssessment(data,) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/background-investigation/insert-applicant-result`
    })
}
export function getBIAssessment(data,) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/background-investigation/get-applicant-result`
    })
}
export function updateBIAssessment(data,) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/background-investigation/update-applicant-result`
    })
}




export function insertHiringRecom(data, id) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/interview-assessment/${id}/insert-hiring-recommendation`,
    })
}

export function updateApplicantAssessed(data) {
    return axios.request({
        method: "POST",
        data: data,
        url: `api/prf/assessment/update-applicant-assessed`,
    })
}


export function getAssessedApplicant(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/prf/assessment/get-assessed-applicant',
    })
}

export async function updateShortlistDatetime(data, controller) {
    return axios.post('api/prf/pooling-applicants/update-date-time', data, { signal: controller.signal })
}

export function revertPoolingApplicant(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/prf/pooling-applicants/revert-pooling-applicants',
    })
}

export function insertAdditionalRater(data) {
    return axios.request({
        method: 'POST',
        data: data,
        url: 'api/prf/assessment/insert-additional-rater',
    })
}