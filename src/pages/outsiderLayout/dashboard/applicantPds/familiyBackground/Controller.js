import axios from "axios";
import { toast } from 'react-toastify'
import Swal from "sweetalert2";

export const getFamilyBackground = async (setState, setChildList, contextId, controller, setLoader, setLoaderChild) => {
    let res = await axios.get(`/api/recruitment/applicant/pds/Education/getFamilyBackground?contextId=${contextId}`, {}, { signal: controller.signal })
    setLoader(false)
    if (res.data.status === 200) {
        setState(res.data.data)
    }
    if (res.data.status === 500) {
        toast.error(res.data.message)
    }
    let childRes = await axios.get(`/api/recruitment/applicant/pds/Children/getChildren?contextId=${contextId}`, {}, { signal: controller.signal })
    setLoaderChild(false)
    if (childRes.data.status === 200) {
        setChildList(childRes.data.data)
    }
    if (res.data.status === 500) {
        toast.error(childRes.data.message)
    }
}

export const handleSubmit = async (state, contextId) => {
    Swal.fire({
        text: 'Processing request . . .',
        icon: 'info'
    })
    Swal.showLoading()
    let res = await axios.post(`/api/recruitment/applicant/pds/Education/submitFamilyBackground`, { state, contextId })
    Swal.close()
    if (res.data.status === 200) {
        toast.success('Saved/Updated', { autoClose: 1000 })
    }
    if (res.data.status === 500) {
        toast.error(res.data.message)
    }
}

export const handleSubmitChild = async (state, setState, contextId, setChildList, handleClose, handleOpenBD, handleCloseBD) => {
    handleOpenBD()
    let res = await axios.post(`/api/recruitment/applicant/pds/Children/submitChildren`, { state, contextId })
    handleCloseBD()
    if (res.data.status === 200) {
        toast.success('Saved', { autoClose: 1000 })
        setChildList(prev => [...prev, { child_name: state.child_name, dob: state.dob }])
        setState({
            child_name: '',
            dob: ''
        })
        handleClose()
    }
    if (res.data.status === 500) {
        toast.error(res.data.message)
    }
}

export const handleUpdateChild = async (state, setState, contextId, toUpdate, handleClose, handleOpenBD, handleCloseBD) => {
    handleOpenBD()
    try {
        let res = await axios.post(`/api/recruitment/applicant/pds/Children/update-children`, { toUpdate, contextId })
        console.log(res)
        if (res.data.status === 200) {
            let updatedChild = state.map((item, i) => item.id === toUpdate.id ? ({ ...item, child_name: toUpdate?.child_name, dob: toUpdate?.dob }) : item)
            setState(updatedChild)
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        handleCloseBD()
        handleClose()
    }
    catch (err) {
        toast.error(err.message)
    }

}

export const handleDeleteChild = (item, childList, setChildList, contextId) => {
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
                text: 'Processing request...',
                icon: 'warning'
            })
            Swal.showLoading()
            try {
                let res = await axios.post(`/api/recruitment/applicant/pds/Children/delete-children`, { item, contextId })
                if (res.data.status === 200) {
                    let deletedChild = childList.filter((x) => x.id !== item.id)
                    setChildList(deletedChild)
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }
                Swal.close()
            }
            catch (err) {
                toast.error(err.message)
            }
        }
    })
}