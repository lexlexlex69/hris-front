import axios from 'axios'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'

export const getEligibility = async(setState,controller,setLoader,page,setTotal,contextId) => {
    try {
        let res = await axios.get(`/api/recruitment/applicant/pds/Eligibility/getEligibility?page=${page}&&contextId=${contextId}`,{},{signal:controller.signal})
        setLoader(false)
        if(res.data.status === 200)
        {
            setState(res.data.applicant_eligibility.data)
            setTotal(res.data.applicant_eligibility.total)
        }
        else if(res.data.status === 500)
        {
            toast.error(res.data.message)
        }
    }
    catch(err){
        toast.error(err)
    }
   
}