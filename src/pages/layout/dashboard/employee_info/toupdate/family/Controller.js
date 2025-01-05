import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getEmployeeWithUpdates = (id, setFamilyState, setUpdateState, setLoader, controller) => { // fetch family info with updates available
    axios.post(`/api/pds/getEmployeeWithUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                setFamilyState(res.data.family)
                setUpdateState(res.data.updates)
                toast.success('Employee information fetched!')
                setLoader(true)
            }
        })
        .catch(err => {
            Swal.close()
            setLoader(false)
            toast.error(err.message)
        })
}

export const updateFamilyInfo = (obj, updates, setState) => { // approve family information
    Swal.fire({
        text: 'processing, please wait . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/pds/family/employeeConfirmUpdate2`, { id: obj.id })
        .then(res => {
            if (res.data.status === 200) {
                toast.success('Updated!', { autoClose: 300 })
                let newObj = Object.assign({}, updates)
                delete newObj[obj.table_field]
                setState(newObj)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message, { autoClose: 850 })
            }
            Swal.close()
            // console.log(res)
        })
        .catch(err => {
            toast.error(err.message)
        })
}