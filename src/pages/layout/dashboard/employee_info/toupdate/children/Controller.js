
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getEmployeeWithUpdates = (id, setFamilyState, setChildrenwithUpdates, setLoader, controller) => { // fetch family info with updates available
    axios.post(`/api/pds/getEmployeeWithUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            Swal.close()
            // console.log(res)
            if (res.data.status === 200) {
                setFamilyState(res.data.family)
                setChildrenwithUpdates(res.data.children)
                toast.success('Employee information fetched!')
                setLoader(true)
            }
        })
        .catch(err => {
            Swal.close()
            setLoader(true)
            toast.error(err.message)
        })
}