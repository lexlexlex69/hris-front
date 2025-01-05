import axios from 'axios'
import {toast} from 'react-toastify'
import Swal from 'sweetalert2'

export const getEmployeeOthers = (id, setState, controller, setPageTotal, setTableData) => {
    axios.post(`/api/pds/others/getEmployeeOthers`, { id: id }, { signal: controller.signal })
        .then(res => {
            if (res.data.status === 200) {
                toast.success('Other information')
                setState(res.data.others)
                let newArr = res.data.others.slice(0, 10)
                setTableData(newArr)
                setPageTotal(res.data.length)
                // setPageLoad(false)
            }
        })
        .catch(err => {
            toast.error(err)
        })
}