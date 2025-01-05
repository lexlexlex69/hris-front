import axios from "axios"

export function getDeptOrgStruct2(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/department-organization-structure/get-all-dept-org"
  })
}
export function updateDeptOrgStruct(data) {
  return axios.request({
    method: "PUT",
    data: data,
    url: "api/department-organization-structure/update-dept-org"
  })
}
