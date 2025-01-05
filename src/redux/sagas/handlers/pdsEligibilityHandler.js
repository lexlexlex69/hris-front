import {call,put} from 'redux-saga/effects'
// actions
import { pdsEligibilityLoad,pdsEligibilitySuccess,pdsEligibilityError } from '../../slice/pdsEligibility'
// request
import { pdsEligibilityRequest } from '../request/pdsEligibilityRequest'
// toastify
import {toast} from 'react-toastify'

// sweetalert
import Swal from 'sweetalert2'

export function* pdsEligibilityHandler(action)
{
    try {
        const {id} = action.payload
        yield put(pdsEligibilityLoad())
        const response = yield call(pdsEligibilityRequest,id)
        const {data} = response
        console.log(data)
        yield put(pdsEligibilitySuccess(data))
    }
    catch(error)
    {
        console.log(error)
        yield put(pdsEligibilityError({error}))
    }
}