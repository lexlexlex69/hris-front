import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getReferencesUpdates = (id, setState, controller, setUpdates, setLoader) => {
    axios.post(`/api/pds/others/getReferencesUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            // console.log(res)
            Swal.close()
            setState(res.data.references)
            setUpdates(res.data.updates)
            setLoader(true)
        })
        .catch(err => {
            toast.error(err.message)
            // console.log(err)
        })
}