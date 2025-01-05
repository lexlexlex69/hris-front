import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const getSpecialSkillsOthersUpdates = (id, setSpecialSkills, setRecognition, setOrganization, setLoader, controller, setUpdates) => {
    axios.post(`/api/pds/others/getEmployeeOthersUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            // console.log('special', res)
            Swal.close()
            if (res.data.status === 200) {
            toast.success('Special skills, etc. updates loaded')
                let specialSkills = res.data.others.filter(item => item.typeid === 1)
                let recognition = res.data.others.filter(item => item.typeid === 2)
                let organization = res.data.others.filter(item => item.typeid === 3)
                setSpecialSkills(specialSkills)
                setRecognition(recognition)
                setOrganization(organization)
                setUpdates(res.data.updates)
                setLoader(true)
            }
        })
        .catch(err => {
            Swal.close()
            setLoader(false)
            toast.error(err.message)
        })
}