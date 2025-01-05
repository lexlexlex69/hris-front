import { call, put } from 'redux-saga/effects'
// actions
import { pdsFamilyBackgroundLoad,pdsFamilyBackgroundSuccess,pdsFamilyBackgroundError } from '../../slice/pdsFamilyBackground'
// request
import { pdsFamilyBackgroundRequest } from '../request/pdsFamilyBackgroundRequest'
// toastify
import { toast } from 'react-toastify';
// sweetalert
import Swal from 'sweetalert2'

export function* pdsFamilyBackgroundHandler(action) {
    try {
        // Swal.fire('Updating Employee, Please wait . . .')
        // Swal.showLoading()
        yield put(pdsFamilyBackgroundLoad())
        const { id } = action.payload
        const response = yield call(pdsFamilyBackgroundRequest, id)
        const { data } = response
        Swal.close()
        yield put(pdsFamilyBackgroundSuccess({ ...data }))
        toast.success('Family Background Loaded')
    }
    catch (error) {
        console.log(error)
        Swal.close()
        toast.error(error.message)
        yield put(pdsFamilyBackgroundError({ error }))
    }
}