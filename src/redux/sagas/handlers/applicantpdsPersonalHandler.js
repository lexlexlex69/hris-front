import {put,call} from 'redux-saga/effects';
//actions
import {getpdsPersonalLoad,pdsPersonalError,pdsPersonalSuccess} from '../../slice/applicantPdsSlice';
//request
import { applicantpdsPersonalRequest } from '../request/applicantpdsPersonalRequest';
// toastify
import { toast } from 'react-toastify';
export function* applicantpdsPersonalHandler(action){
    try{
        yield put(getpdsPersonalLoad())
        const {id} = action.payload 
        const response = yield call(applicantpdsPersonalHandler,id)
        console.log(response)
    }catch(error){
        console.log(error)
        toast.error(error.message)
        yield put(pdsPersonalError({ error }))
    }
}