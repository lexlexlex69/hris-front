import axios from "axios";

export function getExecLogs(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/DTR/api/getExecLogs",
  });
}
export function reExec(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/DTR/reExecBioLogs2",
  });
}
