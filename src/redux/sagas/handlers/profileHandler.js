import {call,put} from 'redux-saga/effects'
import { getProfile,profileLoad,profileSucces,profileError } from '../../slice/profileSlice'
import { profileRequest } from '../request/profileRequest'
// toastify
import { toast } from 'react-toastify';
export function* profileHandler(){
    try{
        yield put(profileLoad())
        const response = yield call(profileRequest)
        const {data} = response
        yield put(profileSucces({...data}))
        // toast.success('loaded')

    }catch(error){
        console.log(error)
        toast.error(error.message)
        yield put(profileError({error}))
    }
}