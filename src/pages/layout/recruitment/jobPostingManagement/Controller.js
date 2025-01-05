import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export const getAllJobPost = async (setState, setLoader, controller, filters, page, setPage, setTotal, perPage) => {
    try {
        let res = await axios.get(`/api/recruitment/getAllJobPost?page=${page}${perPage ? `&&perPage=${perPage}` : ''}${filters.posting_date ? `&&posting_date=${filters.posting_date}` : ''}${filters.closing_date ? `&&closing_date=${filters.closing_date}` : ''}${filters.emp_status ? `&&emp_status=${filters.emp_status}` : ''}${filters.position_name ? `&&position_name=${filters.position_name}` : ''}${filters.vacancy_status ? `&&vacancy_status=${filters.vacancy_status}` : ''}`, { signal: controller.signal })
        console.log(res)
        if (res.data.status === 200) {
            setState(res.data.job_vacancies)
            setTotal(res.data.total)
            setPage(page)
            setLoader(true)
        }
        else {
            toast.error('Error')
            setLoader(true)
        }
    }
    catch (err) {
        toast.error(err.message)
        setLoader(true)
    }
}

export const checkBoxCounter = (index, value, row, checkBox, setCheckBox) => {
    if (checkBox.length > 0) {
        let flag = 0
        let filterer = checkBox.filter(item => item.job_vacancies_id === row.job_vacancies_id)
        if (filterer.length > 0) {
            let newArr = checkBox.map(item => item.job_vacancies_id === row.job_vacancies_id ? { ...item, job_vacancies_id: row.job_vacancies_id, value: value } : item)
            setCheckBox(newArr)
        }
        else {
            setCheckBox(prev => [...prev, { id: row.job_vacancies_id, value: value }])
        }
    }
    else {
        setCheckBox(prev => [...prev, { id: row.job_vacancies_id, value: value }])
    }
}


export const handlePostPosition = async (item, state, setState) => {

    Swal.fire({
        title: item.is_hidden === 1 ? 'Cancel Posting of Vacancy?' : 'Post vacant position?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: item.is_hidden === 1 ? 'Yes' : 'Post!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                text: 'Processing, please wait ...'
            })
            Swal.showLoading()
            let res = await axios.post(`/api/recruitment/postVacantPosition`, {
                data: item
            })
            if (res.data.status === 200) {
                let tempPos = state.map((x) => {
                    if (x.job_vacancies_id === item.job_vacancies_id) {
                        if (res.data.action === 'post') {
                            return { ...x, is_hidden: 1 }
                        }
                        else if (res.data.action === 'cancel_posting') {
                            return { ...x, is_hidden: 0 }
                        }
                    }
                    else {
                        return x
                    }
                })
                setState(tempPos)
            }
            if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            Swal.close()
        }
    })
}

export const handleReOpenPosition = async (item,setReOpenTrigger) => {
    Swal.fire({
        text: 'Processing, please wait . . .',
        icon: 'info'
    })
    Swal.showLoading()
    const res = await axios.post('/api/recruitment/jobPosting/ReOpenPosition', { item })
    Swal.close()
    if (res.data.status === 200) {
        toast.success('Job vacancy created!')
        setReOpenTrigger(true)
    }
    else if (res.data.status === 500) {
        toast.error(res.data.message)
    }
}

export const revertStatus = async (status, vacancyId, pos, setPos, handleCloseStatus) => {
    Swal.fire({
        text: 'Redirecting, please wait . . .',
        icon: 'warning'
    })
    Swal.showLoading()
    console.log(pos)
    let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId })
    console.log(res)
    Swal.close()
    if (res.status === 200 && res.data) {
        handleCloseStatus()
        let newPos = pos.map((item, index) => {
            if (item.job_vacancies_id === vacancyId) {
                return { ...item, vacancy_status: status }
            }
            else {
                return item
            }
        })
        setPos(newPos)
    }
    else {
        handleCloseStatus()
        toast.error('Ops! Something went wrong!')
    }

}