import axios from "axios";
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getPublicatedJobs = (setState, setLoader, filters, pages, perPage, setTotal) => {
    setLoader(true)
    axios.get(`/api/recruitment/getPublicatedJobsAuthenticatedApplicants?page=${pages}&&public=1${filters.posStatus ? `&&status=${filters.posStatus}` : ''}${filters.posName ? `&&search=${filters.posName}` : ''}&&perPage=${perPage}`)
        .then(res => {
            setLoader(false)
            if (res.data.status === 200) {
                setState(res.data.jobs)
                setTotal(res.data.total)
            }
            else if (res.data.status === 500) {
                setState([])
            }

        })
        .catch(err => {
            setLoader(false)
            toast.error(err.message)
        })
}

export const getHistoryOfPositionsPerApplicant = async (setState, setLoader, filters, pages, perPage, setTotal) => {
    setLoader(true)
    try {
        let res = await axios.get(`/api/recruitment/getHistoryOfPositionsPerApplicant?page=${pages}&&public=1${filters.posStatus ? `&&status=${filters.posStatus}` : ''}${filters.posName ? `&&search=${filters.posName}` : ''}&&perPage=${perPage}`)
        setLoader(false)
        if (res.request.status === 200) {
            setState(res.data.jobs)
            setTotal(res.data.total)
        }
        else {
            toast.error(res.request.message)
        }
    }
    catch (err) {
        toast.error(err.message)
    }

}