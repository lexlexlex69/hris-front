import { call, put } from 'redux-saga/effects'
// actions
import { pdsPersonalLoad, pdsPersonalSuccess, pdsPersonalError, PdsPersonalToUpdateClear,pdsPersonalWithUpdateSuccess } from '../../slice/pdsPersonal'
// request
import { pdsPersonalRequest, pdsPersonalUpdate, getPdsPersonalWithUpdateRequest } from '../request/pdsPersonalRequest'
// toastify
import { toast } from 'react-toastify';
// sweetalert
import Swal from 'sweetalert2'

export function* pdsPersonalHandler(action) {
    try {
        yield put(pdsPersonalLoad())
        yield put(PdsPersonalToUpdateClear())
        const { id } = action.payload
        const response = yield call(pdsPersonalRequest, id)
        const { data } = response
        console.log(data)
        Swal.close()
        yield put(pdsPersonalSuccess({ ...data }))
        toast.success('Personal Information Loaded')
    }
    catch (error) {
        console.log(error)
        // Swal.close()
        toast.error(error.message)
        yield put(pdsPersonalError({ error }))
    }
}

export function* pdsPersonalUpdateHandler(action) { // when update button is clicked
    try {

        const { id, personalInfo } = action.payload
        if (Object.keys(personalInfo).length === 0) {
            toast.warning('Nothing to update!')
            return
        }
        console.log(personalInfo)
        Swal.fire('Uploading changes. . .')
        Swal.showLoading()
        let covertObjectToArray = []
        for (let [key, value] of Object.entries(personalInfo)) {
            covertObjectToArray.push({
                table_field: key,
                value: value
            })
        }
        const response = yield call(pdsPersonalUpdate, id, covertObjectToArray)
        const { data } = response
        console.log(data)
        Swal.close()
        if (data.status === 200) {
            toast.success('Changes submitted, please wait for approval of changes!')
        }
        else if (data.status === 500) {
            toast.error('Error' + data.message)
        }
    }
    catch (error) {
        // console.log(error)
        toast.error(error.message)
    }
}

export function* pdsPersonalWithUpdateHandler(action) {
    try {
        yield put(pdsPersonalLoad())
        yield put(PdsPersonalToUpdateClear()) // clear all data in the Personal update state before fetching
        const { id } = action.payload
        const response = yield call(pdsPersonalRequest, id)
        const personRequest = response.data
        yield put(pdsPersonalSuccess({ ...personRequest }))
        const responseWithUpdate = yield call(getPdsPersonalWithUpdateRequest, id)
        const personWithUpdateRequest = responseWithUpdate.data
        console.log(personWithUpdateRequest)
        Swal.close()
        yield put(pdsPersonalWithUpdateSuccess({ ...personWithUpdateRequest }))
        toast.success('Personal Information Loaded')
    }
    catch (error) {
        console.log(error)
        toast.error(error.message)
        yield put(pdsPersonalError({ error }))
    }
}