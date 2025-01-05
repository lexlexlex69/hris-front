import { call, put } from 'redux-saga/effects'
// actions
import { pdsOthersInfoLoad, pdsOthersInfoSuccess, pdsOthersInfoError} from '../../slice/pdsOthers'
import {getPdsOthersChecklist,pdsOthersChecklistLoad,pdsOthersChecklistSuccess,pdsOthersChecklistError } from '../../slice/pdsOthersChecklist'
// actions from pdsotherschecklist
// notify
import { toast } from 'react-toastify'
// request 
import { pdsOthersRequest,pdsOthersChecklistRequest } from '../request/pdsOthersRequest'

export function* pdsOthersHandler(action) {
    try {
        const { id } = action.payload
        yield put(pdsOthersInfoLoad())
        const response = yield call(pdsOthersRequest, id)
        const { data } = response
        yield put(pdsOthersInfoSuccess((data)))
        toast.success('Other information loaded!')
        yield put(getPdsOthersChecklist({id:id}))
        console.log(data)
    }
    catch (error) {
        toast.error(error)
        yield put(pdsOthersInfoError({ error }))
    }
}

export function* pdsOthersChecklistHandler(action)
{
    try {
        const {id} = action.payload
        yield put(pdsOthersChecklistLoad())
        const response = yield call(pdsOthersChecklistRequest,id)
        const {data} = response
        yield put(pdsOthersChecklistSuccess(data))
        toast.success('Checklist loaded!')
        console.log(data)
    }
    catch(error)
    {
        console.log(error)
        yield put(pdsOthersChecklistError({error}))
    }
}