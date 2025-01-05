import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export const handleDelete = async (id, category, state, setState) => {
    let data = {
        id: id,
        category: category
    }
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                text: 'Deleting item',
                icon: 'warning'
            })
            Swal.showLoading()
            let res = await axios.post(`/api/recruitment/applicant/pds/DeleteItemByCategory`, data)
            console.log(res)
            if (res.data.status === 200) {
                let newState = state.filter(x => x.id !== id)
                setState(newState)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            Swal.close()
        }
    })

}