import { call, put } from 'redux-saga/effects'
// actions
import { pdsVoluntaryLoad, pdsVoluntarySuccess, pdsVoluntaryError } from '../../slice/pdsVoluntarty'
// toastify
import {toast} from 'react-toastify'
// request 
import { pdsVoluntartyRequest } from '../request/pdsVoluntaryRequest'

export function* pdsVoluntartyHander(action) {
    try {
        yield put(pdsVoluntaryLoad())
        const { id } = action.payload
        const response = yield call(pdsVoluntartyRequest,id)
        const {data} = response
        yield put(pdsVoluntarySuccess(data))
        toast.success('Voluntary works data loaded!')
    }
    catch (error) {
        console.log(error)
        toast.error(error.message)
        yield put(pdsVoluntaryError(error))
    }
}