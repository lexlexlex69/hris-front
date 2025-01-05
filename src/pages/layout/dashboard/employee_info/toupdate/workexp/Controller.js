import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getWorkExperienceUpdates = (id, setState, controller, setUpdates, setLoader) => {
    axios.post(`/api/pds/workexperience/getWorkExperienceUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            Swal.close()
            if (res.status === 200) {
                toast.success('Work Experience updates loaded')
                setState(res.data.work_experience)
                setUpdates(res.data.updates)
                setLoader(true)
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}