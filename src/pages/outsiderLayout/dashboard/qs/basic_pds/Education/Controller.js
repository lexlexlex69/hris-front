import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'


export const getEducation = async (setState, controller, setLoader, page, setTotal, contextId) => {

    try {
        let res = await axios.get(`/api/recruitment/applicant/pds/Education/getEducation?page=${page}&&contextId=${contextId}`, {}, { signal: controller.signal })
        setLoader(false)
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        if (res.data.status === 200) {
            setState(res.data.applicant_education.data)
            setTotal(res.data.applicant_education.total)
        }

    }
    catch (err) {
        toast.error(err)
    }

}
