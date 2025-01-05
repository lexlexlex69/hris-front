import axios from "axios";

export function getOfficeList() {
  return axios.request({
    method: "GET",
    url: "/api/DTR/getOfficeList",
  });
}
export function getEmpDTRPerOffices(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/getEmpDTRPerOffices",
  });
}
export function getEmpListPerOffices(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/employee/getEmpListPerOffices",
  });
}
export function fetchEmpDTR(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/fetchEmpDTR",
  });
}
export function processDTR(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/processDTR",
    timeout: 300000,
  });
}
export function processDTR2(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/processDTR2",
    timeout: 300000,
  });
}
export function updateLogType(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/updateLogType",
  });
}
export function getAllRectification(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/getAllRectification",
  });
}
export function getAllBioDevices(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/getAllBioDevices",
  });
}
export function reExecBioLogs(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/reExecBioLogs",
  });
}
export function reExecAllBioLogs(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "/api/DTR/reExecAllBioLogs",
  });
}
///lex test
export function testBiofetch(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/DTR/api/getExecLogs",
  });
}
