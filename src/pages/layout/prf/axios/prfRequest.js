import axios from "axios"

export function insertDetails(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf/request-details",
  })
}
export function getDetails(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf/personnel-request-details",
  })
}
export function requestViewPRF(id) {
  return axios.request({
    method: "GET",
    url: "api/prf/personnel-request/" + id,
  })
}

export function getOnePRF(id) {
  return axios.request({
    method: "GET",
    url: "api/prf/request-details/" + id,
  })
}
export function updateOnePRF(id, data) {
  return axios.request({
    method: "PUT",
    data: data,
    url: "api/prf/request-details/" + id,
  })
}

export function updateSalaryValue(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf/request-details/update-salary-value",
  })
}

// FOR DROPDOWN MENU API REQUEST {
export function getNatReqData() {
  return axios.request({
    method: "GET",
    url: "api/prf/personnel-request-nature-request",
  })
}
export function getEmpStatData() {
  return axios.request({
    method: "GET",
    url: "api/prf/personnel-request-employee-status",
  })
}
export function getDeptOrg(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf/get-dept-org",
  })
}
export function getPositionList() {
  return axios.request({
    method: "GET",
    url: "api/prf/get-position-list",
  })
}
export function getQS() {
  return axios.request({
    method: "GET",
    url: "api/prf/personnel-request/get-qualification-standards",
  })
}
export function getDept() {
  return axios.request({
    method: "GET",
    url: "api/prf/get-all-department",
  })
}
export function getOfficeDeptData() {
  return axios.request({
    method: "POST",
    url: "api/prf/personnel-request-hris-dept",
  })
}
export function deleteDetails(id) {
  return axios.request({
    method: "POST",
    url: "api/prf/request-details/delete/" + id,
  })
}
// export function getCourse() {
//     return axios.request({
//         method: 'GET',
//         url: 'api/prf/get-courses'
//     })
// }

// QS {
export function requestDeleteQS(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf/personnel-request/delete-qualification-standard",
  })
}
// }

// API SIGNINGS {
export function reqSignedByHeadDept(id, data) {
  // (")>
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf/approval/head-dept/" + id,
  })
}
export function requestingHeadSigner(id) {
  return axios.request({
    method: "GET",
    url: "api/prf/request-details/signer/head/" + id,
  })
}
export function requestHeadRevSigner(id) {
  return axios.request({
    method: "GET",
    url: "api/prf/review-approval/signer/review/" + id,
  })
}
// }
export function requestSignedDetails(data) {
  // API FOR GETTING THE DETAILS OF EACH APPROVED IN tbl_signings for viewing
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf/signer/details",
  })
}
// API REVIEW {
export function getPRReviewApproval() {
  return axios.request({
    method: "GET",
    url: "api/prf/review-approval",
  })
}
// }

export function reqStatusApi(id) {
  return axios.request({
    method: "GET",
    url: "api/prf/request-status/" + id,
  })
}

// APPROVAL PERMISSION BUTTON {
export function reqApprovalData(id) {
  return axios.request({
    method: "GET",
    url: "api/prf/personnel-request/approval/" + id,
  })
}

export function reqAppUserAuthority(id) {
  return axios.request({
    method: "GET",
    url: "api/prf/personnel-request/user-permission/" + id,
  })
}
// }

// Tracker {
export function getAllOrgDSU() {
  return axios.request({
    method: "GET",
    url: "api/prf/get-all-dept-org",
  })
}
export function requestOrgDSU(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf/add-div-sec-uni",
  })
}
// }

//printable lex
export function get_all_prf_summaryOfCandidContent(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf-pritables/get_all_prf_summaryOfCandidContent",
  })
}
export function searchEmployee(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/employee/searchEmployee",
  })
}
export function saveDesign(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf-pritables/store_prf_printable_design",
  })
}
