import axios from "axios";
import Swal from "sweetalert2";
import { toast } from 'react-toastify'

export const getProfiling = async (setState, setLoader, setTotal, setPage, page, perPage, controller) => {
  let res = await axios.get(`/api/recruitment/profiling/getProfiling?page=${page}&&perPage=${perPage}`, {}, { signal: controller.signal })
  console.log(res)
  setLoader(false)
  if (res.data.status === 200) {
    setState(res.data.profiling.data)
    setTotal(res.data.profiling.total)
    setPage(res.data.profiling.current_page)
  }
}

export const handleSearch = async (searchName, searchType, setState, setLoader, setTotal, setPage, page, perPage) => {
  let controller = new AbortController()
  if (searchName && searchType === 'none') {
    toast.warning('Applicant cant is required!')
    return
  }
  setLoader(true)
  let res = await axios.get(`/api/recruitment/profiling/searchProfiling?page=${page}&&search_name=${searchName}&&search_type=${searchType}&&perPage=${perPage}`, {}, { signal: controller.signal })
  if (res.data.status === 200) {
    setState(res.data.profiling.data)
    setTotal(res.data.profiling.total)
    setPage(res.data.profiling.current_page)
  }
  setLoader(false)



}