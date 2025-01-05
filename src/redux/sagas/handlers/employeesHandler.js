import {call,put} from 'redux-saga/effects'
// actions
import {employeesLoad,employeesSuccess,employeesError  } from '../../slice/employeesSlice'
// request
import {employeesRequest} from '../request/employeesRequest'


export function* employeesHandler(action)
{
    yield put(employeesLoad())
    try{
        const response = yield call(employeesRequest)
        const {data} = response
        yield put(employeesSuccess(data))
    }
    catch(error){
        console.log(error)
        yield put(employeesError({error}))
    }
}
