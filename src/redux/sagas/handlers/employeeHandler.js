import {call,put} from 'redux-saga/effects'
import { employeeLoad,employeeSuccess,employeeError, employeeUpdateLoad, employeeUpdateSuccess, employeeUpdateError } from '../../slice/employeeSlice'
import {employeeRequest,employeeUpdateRequest} from '../request/employeeRequest'
// toastify
import { toast } from 'react-toastify';
// sweetalert
import Swal from 'sweetalert2'

export function* employeeHandler(action)
{
    try{
        yield put(employeeLoad())
        const {payload} = action
        const emp_id = payload.id
        const response = yield call(employeeRequest,emp_id)
        const {data} = response
        yield put(employeeSuccess({...data}))
    }
    catch(error){
        console.log(error)
        toast.error(error.message)
        yield put(employeeError({error}))
    }
}

export function* employeeUpdateHandler(action) {
    try {
        Swal.fire('Updating Employee, Please wait . . .')
        Swal.showLoading()
        // yield put(employeeUpdateLoad())
        const { employee } = action.payload
        const response = yield call(employeeUpdateRequest, employee.employee)
        const { data } = response
        console.log(data)
        Swal.close()
        yield put(employeeUpdateSuccess({ ...data }))
        toast.success('Employee Info Updated!')
    }
    catch (error) {
        console.log(error)
        Swal.close()
        toast.error(error.message)
        // yield put(employeeUpdateError({ error }))
    }
}