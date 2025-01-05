import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getEducationUpdates = (id, setState, controller, setUpdates, setLoader) => {
    axios.post(`/api/pds/education/getEducationUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            // console.log(res)
            Swal.close()
            if (res.status === 200) {
                toast.success('Educational background updates loaded')
                setState(res.data.education)
                setUpdates(res.data.updates)
                setLoader(true)
            }
        })
        .catch(err => {
            setLoader(true)
            toast.error(err.message)
            //console.log(err)
        })
}