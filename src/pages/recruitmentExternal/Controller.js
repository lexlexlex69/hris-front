import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export const getPublicatedJobs = async(setState, setLoader, filters, pages,setPages, setTotal,perPage) => {
    setLoader(true)
   let res = await axios.get(`/api/recruitment/getPublicatedJobs?page=${pages}&&public=1${filters.posStatus ? `&&status=${filters.posStatus}` : ''}${filters.posName ? `&&search=${filters.posName}` : ''}&&per_page=${perPage}`)
   setLoader(false)
   if(res.request?.status === 200)
   {
    setState(res.data.jobs)
    setTotal(res.data.total)
    setPages(pages)
   }   
        console.log(res)
}


export const customSorting = (param, data, column, setState) => {
    if (typeof (param) === 'string') {
        let dumData = [...data]
        switch (param) {
            case 'asc': {
                dumData.sort((a, b) => (a[column] > b[column]) ? 1 : -1)
                setState(dumData)
                break
            }
            case 'desc': {
                dumData.sort((a, b) => (b[column] < a[column]) ? -1 : 1)
                setState(dumData)
                break
            }
            default: return
        }

    }
    if (typeof (param) === 'object') {
        let dumData = [...data]
        switch (param.order) {
            case 'asc': {
                dumData.sort((a, b) => Number(a[column]) - Number(b[column]))
                setState(dumData)
                break
            }

            case 'desc': {
                dumData.sort((a, b) => Number(b[column]) - Number(a[column]))
                setState(dumData)
                break
            }

            default: return
        }
    }
}

export const handleRegister = (navigate) => {
    Swal.fire({
        text: 'redirecting to user-registration',
        icon: 'info'
    })
    Swal.showLoading()
    setTimeout(() => {
        Swal.close()
    navigate(`/${process.env.REACT_APP_HOST}/user-registration`)
    },
        1000)

}