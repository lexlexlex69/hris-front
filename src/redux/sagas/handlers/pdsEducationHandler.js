import { call, put } from 'redux-saga/effects'
// actions
import { pdsEducationLoad,pdsEducationSuccess,pdsEducationError } from '../../slice/pdsEducation'
// request
import { pdsEducationRequest } from '../request/pdsEducationRequest'
// toastify
import { toast } from 'react-toastify';
// sweetalert
import Swal from 'sweetalert2'

export function* pdsEducationHandler(action) {
    try {
        yield put(pdsEducationLoad())
        const { id } = action.payload
        const response = yield call(pdsEducationRequest, id)
        const { data } = response
        Swal.close()
        yield put(pdsEducationSuccess({ ...data }))
        toast.success('Educational Background Loaded')
    }
    catch (error) {
        console.log(error)
        toast.error(error.message)
        yield put(pdsEducationError({ error }))
    }
}