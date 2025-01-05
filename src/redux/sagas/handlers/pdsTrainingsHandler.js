import {call,put} from 'redux-saga/effects'
// actions
import {pdsTrainingsLoad,pdsTrainingsSuccess,pdsTrainingsError} from '../../slice/pdsTrainings'
// request
import { pdsTrainingsRequest } from '../request/pdsTrainingsRequest'
// toastify
import {toast} from 'react-toastify'

export function* pdsTrainingsHandler(action){
    try {
        yield put(pdsTrainingsLoad())
        const {id} = action.payload
        const response = yield call(pdsTrainingsRequest,id)
        const {data} = response
        yield put(pdsTrainingsSuccess(data))
        toast.success('Trainings data loaded!')
        console.log(id)
    }
    catch(error)
    {
        console.log(error)
        toast.error(error)
        yield put(pdsTrainingsError({error}))
    }
}