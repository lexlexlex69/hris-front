import axios from "axios";
import Swal from "sweetalert2";
import { toast } from 'react-toastify'

export const getApplicantNotifications = async (setExam, setInterview, setRemarks, setAppointed, setReview, setLoader, setNotifLoaders, controller) => {
    let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantNotifications`, {}, { signal: controller.signal })
    let tempExam = res.data.data.filter(item => {
        if (item?.exam_notif === 1 && item?.exam_mark_read === 0) {
            return item
        }
    })
    let tempInterview = res.data.data.filter(item => {
        if (item?.interview_notif === 1 && item?.interview_mark_read === 0) {
            return item
        }
    })

    let tempAppointed = res.data.data.filter(item => {
        if (item?.is_appoint === 1 && item?.appoint_mark_read === 0) {
            return item
        }
    })


    setNotifLoaders(prev => ({
        ...prev,
        exam: false,
        interview: false,
        appointed: false,
    }))
    setExam(tempExam)
    setInterview(tempInterview)
    setAppointed(tempAppointed)
    setRemarks(res.data.remarks)
}

export const markAsRead = async (e, el, category, state, setState, setMarkLoader) => {
    if (e.target.checked) {
        setMarkLoader(el.profile_id)
        let res = await axios.post(`/api/recruitment/applicant/dashboard/markNotificationsAsRead`, {
            item: el,
            category: category
        })
        console.log(res)
        if (res.data.status === 200) {
            if (category === 'remarks') {
                let newState = state.filter(item => item.id !== el.id)
                setState(newState)
                setMarkLoader('')
            }
            else {
                let newState = state.filter(item => item.profile_id !== el.profile_id)
                setState(newState)
                setMarkLoader('')
            }

        }
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
    }
}