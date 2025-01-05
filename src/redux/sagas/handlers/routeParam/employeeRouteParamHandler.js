import {call,put} from 'redux-saga/effects'
import {employeeRouteParamChange} from '../../../slice/employeeRouteParam'

export function* employeeRouteParamHandler(action){
    try{
        const {param} = action.payload
        console.log(param)
        yield put(employeeRouteParamChange(param))
    }
    catch(error)
    {
        console.log(error)
    }
}