import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export const getGidUpdates = (id, setToCompare, setLoader, controller) => {
    axios.post(`/api/pds/others/getGidUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            // console.log('gid', res)
            if (res.data.status === 200) {
                setToCompare(res.data.updates)
                setLoader(true)
            }

        })
        .catch(err => {
            setLoader(false)
            toast.error(err.message)
        })
}

// pds/others/confirmGidUpdates2

export const confirmGid = (obj, state, setState) => {
    Swal.fire({
        text:'processing, please wait . . .',
        icon:'info'
    })
    Swal.showLoading()
    axios.post(`/api/pds/others/confirmGidUpdates2`,{id:obj.id})
        .then(res => {
            Swal.close()
            if(res.data.status === 200)
            {
                toast.success('Updated!',{autoClose:300})
                let newObj = Object.assign({}, state)
                delete newObj[obj.table_field]
                setState(newObj)
            }
            else if(res.data.status === 500){
                toast.error(res.data.message,{autoClose:850})
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}