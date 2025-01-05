import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export const getReference = async (setReferences, controller, setLoader, contextId) => {
    try {
        let res = await axios.get(`/api/recruitment/applicant/pds/references/getReferences?contextId=${contextId}`, {}, { signal: controller.signal })
        setLoader(false)
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        if (res.data.status === 200) {
            setReferences(res.data.references)
        }

    }
    catch (err) {
        toast.error(err)
    }
}

export const handleDelete = async (item, references, setReferences, setLoader) => {
    Swal.fire({
        text: "Delete item?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
    }).then(async(result) => {
        if (result.isConfirmed) {
            Swal.fire({
                text: 'Processing, Please wait . . . ',
                icon: 'info'
            })
            Swal.showLoading()
            setLoader(true)
            let res = await axios.post(`/api/recruitment/applicant/pds/references/deleteReference`, item)
            if (res.data.status === 200) {
                let filteredReference = references.filter((x) => x.id !== item.id)
                setReferences(filteredReference)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            Swal.close()
            setLoader(false)
        }
    })

}
