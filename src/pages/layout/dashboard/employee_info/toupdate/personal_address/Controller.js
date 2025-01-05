import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const employeePersonalwithUpdate = (id, setPersonalWithUpdates, setLoader, controller) => {
    axios.post(`/api/pds/personal/employeePersonalwithUpdate`, { id: id }, { signal: controller.signal })
        .then(res => {
            // console.log('address', res)
            if (res.data.status === 200) {
                // setState(res.data.personalInfo)
                setPersonalWithUpdates(res.data.updates)
                setLoader(true)
            }
        })
        .catch(err => {
            setLoader(true)
            // console.log(err)
            toast.error(err.message)
        })
}

export const handleUpdatePersonalAddress = (obj, updates, setState) => { // approve family information
    Swal.fire({
        text: 'processing, please wait . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/pds/personal/employeePersonalConfirmUpdate2`, { id: obj.id })
        .then(res => {
            // console.log(res)
            if (res.data.status === 200) {
                toast.success('Updated!', { autoClose: 300 })
                let newObj = Object.assign({}, updates)
                delete newObj[obj.table_field]
                setState(newObj)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message, { autoClose: 300 })
            }
            Swal.close()

            // console.log(res)
        })
        .catch(err => {
            toast.error(err.message)
        })
}