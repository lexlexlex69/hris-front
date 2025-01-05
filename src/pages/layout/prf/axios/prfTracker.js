import axios from "axios"
import { toast } from "react-toastify"

// PRF TRACKER
export function getAllPrf(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/prf-tracker/get-prf-list",
  })
}

export async function updatePRF(data) {
  return axios.request({
    method: 'POST',
    data: data,
    url: 'api/prf/update-prf-status',
  })
}
// }