import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getEligibilityUpdates = (id, setState, controller, setUpdates, setLoader) => {
    axios.post(`/api/pds/eligibility/getEligibilityUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            // console.log(res)
            Swal.close()
            if (res.status === 200) {
                toast.success('Eligibility Updates loaded')
                setState(res.data.eligibility)
                setUpdates(res.data.updates)
                setLoader(true)
            }
        })
        .catch(err => {
            toast.error(err.message)
            //console.log(err)
        })
}