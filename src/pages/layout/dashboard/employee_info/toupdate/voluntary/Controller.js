
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getVoluntaryUpdates = (id, setState, controller, setUpdates, setLoader) => {
    axios.post(`/api/pds/voluntary/getVoluntaryUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            // console.log(res)
            Swal.close()
            if (res.status === 200) {
                toast.success('Voluntary work updates loaded')
                setState(res.data.voluntary)
                setUpdates(res.data.updates)
                setLoader(true)
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
            //console.log(err)
        })
}