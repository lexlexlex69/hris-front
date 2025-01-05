import { call, put } from 'redux-saga/effects'

import { logoutRequest } from '../request/logoutRequest';
// toastify
import { toast } from 'react-toastify';
// sweetalert
// get user info if login was successfull
import { getInfoSuccess,destroyInfo } from '../../slice/userInformationSlice';


export function* logoutHandler(action) {
    try {
        const {navigate } = action.payload
        const response = yield call(logoutRequest)
        const { data } = response
        console.log(data)
        // if (data.status === 200) {
        //     localStorage.setItem('hris_token', '')
        //     localStorage.setItem('hris_name', '')
        //     localStorage.setItem('hris_roles', '')
        //     localStorage.setItem('hris_employee_id', '')  
        //     localStorage.setItem('id', '')

        //     navigate('/')
        // }
        localStorage.clear(); 
        // yield put(destroyInfo())

        window.location.href = '/'

        toast.success('Successfully logout !')

    }
    catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}