import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export const getEmployeeUpdateCount = async (setState, setInfo, setTotal, setPdsTotalBadge, setIssues, setInterview, limit, setPic) => {

    try {
        let pic = await axios.post(`/api/userprofile/getProfilePic`, {}, { responseType: 'blob' })
        const isJsonBlob = (data) => data instanceof Blob && data.type === "application/json";
        const responseData = isJsonBlob(pic?.data) ? await (pic?.data)?.text() : pic?.data || {};
        const responseJson = (typeof responseData === "string") ? JSON.parse(responseData) : responseData;
        if (responseJson?.status === 500) {
            toast.warning(responseJson?.message)
        }
        else {
            const url = URL.createObjectURL(pic.data);
            setPic(url)
        }
    }
    catch (err) {
        toast.warning('Profile image not set!')
    }

    try {
        let employeInfo = await axios.post(`/api/dashboard/employee_info/getEmployeeInfo`)
        if (employeInfo.data.status === 200) {
            setInfo(employeInfo.data.employee)
        }
    }
    catch (e) {
        toast.error(e.message)
    }
    if (localStorage.getItem('hris_roles') === '1') {
        try {
            let updateCount = await axios.post(`/api/dashboard/employee_info/getEmployeeUpdateCount?limit=${limit}`)
            // console.log('Update count',updateCount)
            if (updateCount.data.status === 200) {
                let newUpdates = updateCount.data.updates.map((item, index) => ({ ...item, fullName: item?.fname + ' ' + item?.mname + ' ' + item?.lname }))
                setState(newUpdates)
                setTotal(updateCount.data?.total)
                setPdsTotalBadge(updateCount.data?.total)
            }

        }
        catch (e) {
            toast.error(e.message)
        }

        try {
            let bugs = await axios.get(`/api/bugs/getAllBugsAdmin`)
            if (bugs.data.status === 200) {
                setIssues(bugs.data.bugs)
            }
        }
        catch (err) {
            toast.error(err)
        }

    }

    try {
        let interview = await axios.get(`/api/recruitment/interview/employee-applicant/getIntervieweesByUser`)
        // console.log('interview', interview)
        setInterview({ data: interview.data })
    }
    catch (err) {
        toast.error(err)
    }
}

export const getEmployeeUpdateCountSearchName = async (setState, limit, setPdsLoader, name, setTotal) => {
    setPdsLoader(false)
    axios.post(`/api/dashboard/employee_info/getEmployeeUpdateCount?limit=${limit}${name ? `&&name=` + name : ``}`)
        .then(res => {
            // console.log(res)
            if (res.data.status === 200) {
                setPdsLoader(true)
                let newUpdates = res.data.updates.map((item, index) => ({ ...item, fullName: item?.fname + ' ' + item?.mname + ' ' + item?.lname }))
                setTotal(res.data?.total)
                setState(newUpdates)
                // setState(res.data.updates)
            }
        })
        .catch(err => {
            toast.error(err.message)
            setPdsLoader(true)
        })
}

export const handleNextPrev = (setState, setInfo, setIssues, limit, setPdsLoader, name) => {
    setPdsLoader(false)
    axios.post(`/api/dashboard/employee_info/getEmployeeUpdateCount?limit=${limit}${name ? `&&name=` + name : ``}`)
        .then(res => {
            if (res.data.status === 200) {
                let newUpdates = res.data.updates.map((item, index) => ({ ...item, fullName: item?.fname + ' ' + item?.mname + ' ' + item?.lname }))
                setState(newUpdates)
                setTimeout(() => setPdsLoader(true), 500)
            }
        })
        .catch(err => {
            toast.error(err.message)
            setPdsLoader(true)
        })
}

export const handleNavigate = (id, status, navigate) => {
    Swal.fire({
        text: 'Redirecting page . . . ',
        icon: 'info'
    })
    Swal.showLoading()
    setTimeout(() => {
        if (status === 'admin') {
            navigate(`view-pds/${id}`)
            Swal.close()
        }
        else if (status === 'employee') {
            navigate(`view-pds`)
            Swal.close()
        }

    }, 500)
}
