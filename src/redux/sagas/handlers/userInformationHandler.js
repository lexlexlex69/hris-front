import {call,put} from 'redux-saga/effects'
import { userInformationRequest,userPDSRequest,updateUserPasswordRequest } from '../request/userInformationRequest'
import { getInfoSuccess,hasPDSSuccess,updateUserPasswordSuccess } from '../../slice/userInformationSlice';
// toastify
import { toast } from 'react-toastify';
export function* userInformationhandler(){
    try{
        const response = yield call(userInformationRequest)
        const {data} = response;
        yield put(getInfoSuccess(data))
    }catch(error){
        console.log(error)
        toast.error(error.message)
    }
}
export function* hasPDSHandler(){
    try{
        const response = yield call(userPDSRequest)
        const {data} = response;
        yield put(hasPDSSuccess(data))
    }catch(error){
        console.log(error)
        toast.error(error.message)
    }
}
export function* updateUserPasswordHandler(action){
    try{
        const response = yield call(updateUserPasswordRequest,action.payload)
        const {data} = response;
        if(data.status === 'success'){
            yield put(updateUserPasswordSuccess(true))
            toast.success('Password successfully updated.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }else{
            toast.error('Password not match.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            yield put(updateUserPasswordSuccess(false))
        }
        return data;
    }catch(error){
        console.log(error)
        toast.error(error.message)
    }
}