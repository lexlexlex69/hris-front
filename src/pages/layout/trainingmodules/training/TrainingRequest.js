import axios from "axios";

export function addNewTraining(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/addNewTraining'
    })
}
export function getTrainings(){
    return axios.request({
        method:'GET',
        url:'api/training/getTrainings'
    })
}
export function getAvailableTrainings(){
    return axios.request({
        method:'GET',
        url:'api/training/getAvailableTrainings'
    })
}
export function getAllTrainingName(){
    return axios.request({
        method:'GET',
        url:'api/training/getAllTrainingName'
    })
}
export function getTrainerByMetaTags(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/trainer/getTrainerByMetaTags'
    })
}
export function getTrainingRqmt(){
    return axios.request({
        method:'GET',
        url:'api/trainer/getTrainingRqmt'
    })
}
export function getMetaTagsData(){
    return axios.request({
        method:'GET',
        url:'api/metatags/getMetaTagsData'
    })
}
export function generateShortlist(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/generateShortlist'
    })
}
export function addTrainingDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/addTrainingDetails'
    })
}
export function getTrainingsDetails(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getTrainingsDetails'
    })
}
export function getTrainingsDetailsTrainer(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getTrainingsDetailsTrainer'
    })
}
export function getTrainingsDetailsEmpNames(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getTrainingsDetailsEmpNames'
    })
}
export function getParticipantsRqmt(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getParticipantsRqmt'
    })
}
export function updateRemarks(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/updateRemarks'
    })
}
export function getAllAssignTrainer(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getAllAssignTrainer'
    })
}
export function updateToEvaluateIDs(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/updateToEvaluateIDs'
    })
}
export function getEvaluationStatus(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getEvaluationStatus'
    })
}
export function getLearningMaterials(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/getLearningMaterials'
    })
}
export function addLearningMaterials(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/addLearningMaterials'
    })
}
export function deleteLearningMaterials(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/training/deleteLearningMaterials'
    })
}
export function getUpdateTrainerByMetaTags(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/trainer/getUpdateTrainerByMetaTags'
    })
}
export function getDeptDetails(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getDeptDetails'
    })
}
export function getUpdateTrainerSched(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/trainer/getUpdateTrainerSched'
    })
}
export function updateTrainingDetails(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/updateTrainingDetails'
    })
}
export function deleteTrainingDetails(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/deleteTrainingDetails'
    })
}
export function getFinishedTrainings(){
    return axios.request({
        method:'GET',
        url:'api/certificate/getFinishedTrainings'
    })
}
export function getCompletedTrainee(data){
    return axios.request({
        method:'POST',
        data:data,
        url:'api/certificate/getCompletedTrainee'
    })
}
export function getTemplate(){
    return axios.request({
        method:'GET',
        url:'api/certificate/getTemplate'
    })
}
export function getEvaluationResults(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getEvaluationResults'
    })
}
export function getEvaluationResultsPerSpeaker(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getEvaluationResultsPerSpeaker'
    })
}
export function getAllNominationApproval(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getAllNominationApproval'
    })
}
export function getTraineeapprovalByDept(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/traineeapproval/getTraineeapprovalByDept'
    })
}
export function updateApprovedTraineeByDept(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/traineeapproval/updateApprovedTraineeByDept'
    })
}
export function getTraineeEvaluation(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getTraineeEvaluation'
    })
}
export function getTrainingVenueList(){
    return axios.request({ 
        method:'GET',
        url:'api/training/getTrainingVenueList'
    })
}
export function getTrainingDetailsRqmt(data){
    return axios.request({ 
        method:'POST', 
        data:data,
        url:'api/training/getTrainingDetailsRqmt'
    })
}
export function getTrainingType(){
    return axios.request({ 
        method:'GET',
        url:'api/training/getTrainingType'
    })
}
export function addSanctionDate(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/addSanctionDate'
    })
}
export function postTrainingToPDS(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/postTrainingToPDS'
    })
}
export function getAlreadyPostedPDS(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getAlreadyPostedPDS'
    })
}
export function deleteTrainingName(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/deleteTrainingName'
    })
}
export function getAllTrainingVenueList(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getAllTrainingVenueList'
    })
}
export function addNewVenue(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/addNewVenue'
    })
}
export function deleteVenue(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/deleteVenue'
    })
}
export function updateVenue(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/updateVenue'
    })
}
export function getShortlistPerDept(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getShortlistPerDept'
    })
}
export function getTrainingEmpNames(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getTrainingEmpNames'
    })
}
export function getTrainingTrainers(data){
    return axios.request({ 
        method:'POST',
        data:data,
        url:'api/training/getTrainingTrainers'
    })
}