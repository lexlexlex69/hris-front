import axios from "axios";

export function getAllTrainerData(){
    return axios.request({
        method:'get',
        url:'api/trainer/getAllTrainerData'
    })
}
export function postTrainer(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postTrainer'
    })
}
export function deleteTrainer(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/deleteTrainer'
    })
}
export function postUpdateTrainer(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateTrainer'
    })
}
export function getMetaTagsData(){
    return axios.request({
        method:'GET',
        url:'api/metatags/getMetaTagsData'
    })
}
export function postUpdateTrainerProfileForm(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateTrainerProfileForm'
    })
}
export function postUpdateAddress(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateAddress'
    })
}
export function postUpdateAcadQ(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateAcadQ'
    })
}
export function postUpdateProfAff(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateProfAff'
    })
}
export function postUpdateTrainingAtt(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateTrainingAtt'
    })
}
export function postUpdateProfExp(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateProfExp'
    })
}
export function postUpdateTechExpertise(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateTechExpertise'
    })
}
export function postUpdateReferences(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateReferences'
    })
}
export function postUpdateMetaTags(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/postUpdateMetaTags'
    })
}
export function getCourse(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/getCourse'
    })
}