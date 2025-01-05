import axios from "axios";

export const checkAssessmentStatusReq = (id) => {
  return axios.request({
    method: "GET",
    url: `api/prf/interview-assessment/status/${id}`,
  })
};

export const setSelectedAApplicant = (data) => {
  return axios.request({
    method: "PUT",
    data: data,
    url: 'api/prf/assessment/update-selected-applicant'
  })
}
