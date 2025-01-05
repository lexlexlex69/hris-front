import { call, put } from 'redux-saga/effects'
// actions
import { loginVerifiedLoad, loginVerifiedError, loginVerifiedSuccess } from '../../slice/emailVerificationSlice';
// request
import { loginRequest } from '../request/loginRequest'
// toastify
import { toast } from 'react-toastify';
// sweetalert
import Swal from 'sweetalert2'

export function* emailVerificationHandler(action) {
    try {
        yield put(loginVerifiedLoad())
        const { username, password } = action.payload
        const response = yield call(loginRequest, username, password)
        const { data } = response
        if (data.status === 200) {
            // localStorage.setItem('hris_token', data.token)
            // localStorage.setItem('hris_name', data.name)
            // localStorage.setItem('hris_roles', data.roles)
            // localStorage.setItem('hris_employee_id', data.employee_id)
            localStorage.setItem('hris_token', data.token)
            localStorage.setItem('hris_name', data.name)
            localStorage.setItem('hris_roles', data.roles)
            if (data.user_type === 0) {
                localStorage.setItem('hris_applicant_id', data.applicant_id)
                localStorage.setItem('hris_applicant_fname', data.fname)
                localStorage.setItem('hris_applicant_mname', data.mname)
                localStorage.setItem('hris_applicant_lname', data.lname)
            } else {
                localStorage.setItem('hris_employee_id', data.employee_id)
            }
            window.location.href = "/hris/homepage"
        }
        Swal.close()
        yield put(loginVerifiedSuccess({ ...data }))
        toast.success('Welcome ' + data.name)
    }
    catch (error) {
        console.log(error)
        toast.error(error.message)
        yield put(loginVerifiedError({ error }))
    }
}