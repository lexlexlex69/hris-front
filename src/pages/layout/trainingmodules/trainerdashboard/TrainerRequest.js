import axios from 'axios';

export function getTrainerMenus(){
    return axios.request({
        method:'GET',
        url:'/api/trainerdashboard/getTrainerMenus'
    })
}
export function getTrainerAssignTrainings(){
    return axios.request({
        method:'GET',
        url:'/api/trainerdashboard/getTrainerAssignTrainings'
    })
}