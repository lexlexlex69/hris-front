import axios from "axios";
import { Controller } from "react-spring";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export const getSkillsHobbies = async (setHobby, setRecognition, setOrganization, setLoader, contextId, controller) => {
    let res = await axios.get(`/api/recruitment/applicant/pds/SkillsHobbies/getSkillsHobbies?contextId=${contextId}`, {}, { signal: controller.signal })
    setLoader(false)
    if (res.data.status === 200) {
        let hobby = res.data.data.filter((item) => item.typeid === 1)
        let recognition = res.data.data.filter((item) => item.typeid === 2)
        let organization = res.data.data.filter((item) => item.typeid === 3)
        setHobby(hobby)
        setRecognition(recognition)
        setOrganization(organization)
    }
    if (res.data.status === 500) {
        toast.error(res.data.message)
    }
}

export const handleSubmit = async (e, hobby, recognition, organization, category, setCategory, setState, contextId, setHobbyList, setRecognition, setOrganization, handleClose, handleOpenBackdrop, handleCloseBackdrop) => {
    e.preventDefault()
    handleOpenBackdrop()
    let res = await axios.post(`/api/recruitment/applicant/pds/SkillsHobbies/submitSkillsHobbiess`, { state: hobby, category, contextId })
    handleCloseBackdrop()
    if (res.data.status === 200) {
        if (category === 1) {
            setHobbyList(prev => [...prev, { description: hobby, id: res.data?.id }])
        }
        else if (category === 2) {
            setRecognition(prev => [...prev, { description: hobby, id: res.data?.id }])
        }
        else if (category === 3) {
            setOrganization(prev => [...prev, { description: hobby, id: res.data?.id }])
        }
        setState('')
        setCategory('')
        handleClose()
    }
    if (res.data.status === 500) {
        toast.error(res.data.message)
    }
}

export const handleDelete = async (id, category, state, setHobby, setRecognition, setOrganization) => {
    let data = {
        ids: id,
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
            let res = await axios.post(`/api/recruitment/applicant/pds/SkillsHobbies/deleteSkillsHobbiess`, data)
            if (res.data.status === 200) {
                if (category === 1) {
                    let hobby = state.filter(x => x.id !== id)
                    setHobby(hobby)
                }
                else if (category === 2) {
                    let recognition = state.filter(x => x.id !== id)
                    setRecognition(recognition)
                }
                else if (category === 3) {
                    let organization = state.filter(x => x.id !== id)
                    setOrganization(organization)
                }

            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            Swal.close()
        }
    })

}