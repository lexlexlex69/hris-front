import { call, put } from 'redux-saga/effects'
// actions
import { pdsConfirmLoad, pdsConfirmSuccess } from '../../slice/pdsCommon'
import { PdsPersonalConfirmSuccess } from '../../slice/pdsPersonal'
// request
import { confirmPdsPersonalInfo, confirmPdsAddress } from '../request/pdsCommonRequest'

// toastify
import { toast } from 'react-toastify'

export function* confirmChanges(action) {
    try {
        console.log(action.payload)
        const { toUpdateState } = action.payload
        switch (toUpdateState.new.table_name) {
            case 'hris_employee':
                {
                    try {
                        yield put(pdsConfirmLoad())
                        const response = yield call(confirmPdsPersonalInfo, toUpdateState)
                        const { data } = response
                        console.log(data)
                        if (data.status === 200) {
                            toast.success(`${toUpdateState.new.table_field} Updated!`)
                            yield put(pdsConfirmSuccess())
                            yield put(PdsPersonalConfirmSuccess({ ...data }))
                        }
                        else {
                            yield put(pdsConfirmSuccess())
                            toast.error(data)
                        }
                    }
                    catch (error) {
                        toast.error(error)
                    }
                    break
                }
            case 'hris_employee_address':
                {
                    try {
                        yield put(pdsConfirmLoad())
                        const response = yield call(confirmPdsAddress, toUpdateState)
                        const { data } = response
                        console.log(data)
                        if (data.status === 200) {
                            toast.success(`${toUpdateState.new.table_field} Updated!`)
                            yield put(pdsConfirmSuccess({ ...data }))
                        }
                        else {
                            yield put(pdsConfirmSuccess())
                            toast.error(data)
                        }
                    }
                    catch (error) {
                        toast.error(error)
                    }
                    break
                }

        }
    }
    catch (error) {
        console.log(error)
    }
}