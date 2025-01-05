import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getTrainingsUpdates = (id, setState, controller, setUpdates, setLoader) => {
    axios.post(`/api/pds/trainings/getTrainingsUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            // console.log(res)
            Swal.close()
            if (res.status === 200) {
                toast.success('Trainings updates loaded')
                setState(res.data.trainings)
                setUpdates(res.data.updates)
                setLoader(true)
            }
        })
        .catch(err => {
            setLoader(true)
            toast.error(err.message)
            Swal.close()
        })
}