import { call, put } from 'redux-saga/effects'
// actions
import { pdsWorkExpLoad, pdsWorkExpSuccess, pdsWorkExpError } from '../../slice/pdsWorkExp'
// request
import { pdsWorkExpRequest } from '../request/pdsWorkExpRequest'
// toastify
import {toast} from 'react-toastify'

export function* pdsWorkExpHandler(action) {

    try {
        const { id } = action.payload
        yield put(pdsWorkExpLoad())
        const response = yield call(pdsWorkExpRequest, id)
        const {data} = response
        console.log(data)
        yield put(pdsWorkExpSuccess(data))
        toast.success('Work experience data loaded!')
    }
    catch (error) {
        toast.error(error.message)
        yield put (pdsWorkExpError({error}))
    }

}