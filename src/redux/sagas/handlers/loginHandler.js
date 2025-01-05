import { call, put } from 'redux-saga/effects'
// actions
import { loginLoad, loginSuccess, loginError } from '../../slice/login'
// request
import { loginRequest } from '../request/loginRequest'
// toastify
import { toast } from 'react-toastify';
// sweetalert
// get user info if login was successfull
import { getInfo, getInfoSuccess } from '../../slice/userInformationSlice';

import Swal from 'sweetalert2'

export function* loginHandler(action) {
    try {
        yield put(loginLoad())
        const { username, password, navigate } = action.payload
        const response = yield call(loginRequest, username, password)
        const { data } = response
        Swal.close()
        if (data.status === 200) {
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
            localStorage.setItem('id', data.id)
            window.location.href  = `/${process.env.REACT_APP_HOST}/homepage`;
            // navigate(`/${process.env.REACT_APP_HOST}/homepage`)
            yield put(getInfo())
            // const { userdata } = userinfo;
            // yield put(getInfoSuccess({ ...userdata }))
        }
        yield put(loginSuccess({ ...data }))

    }
    catch (error) {
        console.log(error)
        toast.error(error.message)
        yield put(loginError({ error }))
    }
}