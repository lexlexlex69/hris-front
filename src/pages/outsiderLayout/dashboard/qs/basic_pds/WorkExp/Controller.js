import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export const getWorkExp = async (setState, controller, setLoader, page, setTotal, contextId) => {

    try {
        let res = await axios.get(`/api/recruitment/applicant/pds/WorkExp/getWorkExp?page=${page}&&contextId=${contextId}`, {}, { signal: controller.signal })
        setLoader(false)
        if (res.data.status === 200) {
            setState(res.data.applicant_workExp.data)
            setTotal(res.data.applicant_workExp.total)
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
    }
    catch (err) {
        toast.error(err)
    }

}