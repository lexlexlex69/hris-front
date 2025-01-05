import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { convertTo64 } from '../../pds/customFunctions/CustomFunctions'

// common
export const getEmployeesSlider = (setEmployees, employees, setLoader, perPage, page, offset, limit, setTotal, name) => {
    setLoader(true)
    axios.get(`/api/dashboard/employee_management/getEmployeesSlicker?page=${page}&&name=${name}&&perPage=${perPage}&&offset=${offset}&&limit=${limit}`)
        .then(res => {
            console.log(res)
            setLoader(false)
            if (name) {
                if (res.data.length <= 0) {
                    toast.error('No result.', { autoClose: 1000 })
                }
                setEmployees(res.data)
                return
            }
            if (employees.length === 0) {
                setEmployees(res.data)
            }
            else {
                let newEmployee = [...employees]
                let newArr = newEmployee.concat(res.data)
                setEmployees(newArr)
            }
            setTotal(prev => (prev + res.data.length))

        })
        .catch(err => {
            setLoader(false)
            let newEmployee = [...employees]
            setEmployees(newEmployee)
            toast.error(err.message)
        })
}

export const getEmployees = (setEmployees, setLoader, page, perPage, setTotal) => {
    axios.post(`/api/dashboard/employee_management/getEmployees`, {
        perPage: perPage,
        page: page,
    })
        .then(res => {
            setEmployees(res.data.employees)
            setTotal(res.data.total)
            setLoader(true)
        })
        .catch(err => {
            setLoader(true)
            toast.error(err.message)
        })
}


// EmploymentManagement
export const handleNext = (num, setNum, name, setEmployees, setLoader, perPage) => {
    setLoader(false)
    num += 1
    axios.post(`/api/dashboard/employee_management/getEmployees?page=${num}${name ? `&&name=${name}` : ''}`,
        { perPage: perPage })
        .then(res => {
            setLoader(true)
            setNum(prev => prev + 1)
            setEmployees(res.data.data)
        })
        .catch(err => {
            setLoader(false)
            toast.error(err.message)
        })
}

export const handlePrev = (num, setNum, name, setEmployees, setLoader, perPage) => {
    setLoader(false)
    if (num <= 1) {
        toast.warning('Reach the beginning of list!')
        setLoader(true)
        return false
    }
    num -= 1
    axios.post(`/api/dashboard/employee_management/getEmployees?page=${num}${name ? `&&name=${name}` : ''}`,
        { perPage: perPage })
        .then(res => {
            setLoader(true)
            setNum(prev => prev - 1)
            setEmployees(res.data.data)
        })
        .catch(err => {
            setLoader(false)
            toast.error(err.message)
        })
}

export const handleSearch = (num, setNum, name, setEmployees, setLoader) => {
    setLoader(false)
    num = 1
    axios.post(`/api/dashboard/employee_management/getEmployees?page=${num}&&name=${name}`)
        .then(res => {
            setLoader(true)
            setNum(1)
            setEmployees(res.data.data)
        })
        .catch(err => {
            setLoader(false)
            toast.error(err.message)
        })
}

export const getOffices = (setLoadOffices, setLoader) => {
    axios.get(`/api/dashboard/employee_management/getOffices`)
        .then(res => {
            setLoader(true)
            setLoadOffices(res.data)
        })
        .catch(err => {
            setLoader(true)
        })
}

// EmploymentManagementMain

export const getEmployeesPaginate = (setEmployees, setLoader, perPage, setTotal, value, office, position, name, active) => {
    setLoader(false)
    axios.post(`/api/dashboard/employee_management/getEmployees?page=${value}${office ? '&&office=' + office : ''}${position ? '&&position=' + position : ''}${name ? '&&byname=' + name : ''}${active ? '&&byname=' + active : ''}`, {
        perPage: perPage
    })

        .then(res => {
            setLoader(true)
            setEmployees(res.data.employees)
            setTotal(res.data.total)
        })
        .catch(err => {
            setLoader(true)
            toast.error(err.message)
        })
}

export const EmployeeMainSearch = (office, position, name, active, perPage, setLoader, setTotal, setEmployees, setPage) => {
    Swal.fire({
        text: 'please wait . . . ',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/dashboard/employee_management/getEmployees?${office ? 'office=' + office : ''}${position ? '&&position=' + position : ''}${name ? '&&byname=' + name : ''}${active ? '&&active=' + active : ''}`, {
        perPage: perPage
    })
        .then(res => {
            Swal.close()
            setLoader(true)
            setEmployees(res.data.employees)
            setTotal(res.data.total)
            setPage(1)
        })
        .catch(err => {
            Swal.close()
            setLoader(false)
            toast.error(err.message)
        })
}

export const handleRevoke = (item, emps, setEmps) => {
    Swal.fire('please wait . . . ')
    Swal.showLoading()
    axios.post(`/api/dashboard/employee_management/revoke`, {
        old_office: item.dept_code,
        office: item.dept_code,
        emp_no: item.emp_no,
    })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                let filterEmployee = emps.filter(x => x.emp_no === item.emp_no)
                let new_re_assign = []
                if (filterEmployee.re_assign) {
                    new_re_assign = filterEmployee.re_assign.push({
                        new_dept_id: item.dept_code,
                        old_dept_id: item.dept_code
                    })
                }
                else {
                    new_re_assign.push({
                        new_dept_id: item.dept_code,
                        old_dept_id: item.dept_code
                    })
                }

                let mapEmployee = emps.map(x => {
                    if (x.emp_no === item.emp_no) {
                        return { ...x, re_assign: new_re_assign }
                    }
                    else {
                        return x
                    }
                })

                setEmps(mapEmployee)
            }
            Swal.close()
        })
        .catch(err => {
            Swal.close()
        })
}

export const handleInactiveDateEffective = (id, date, setDate, emps, setEmps) => {
    Swal.fire('Updating, please wait . . .')
    Swal.showLoading()
    setDate(date)
    axios.post(`/api/dashboard/employee_management/updateInactiveEffectiveDate`, {
        emp_no: id,
        effective_date: date
    })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                let updatedEmps = emps.map(x => x.emp_no === id ? { ...x, date_inactive_effective: date } : x)
                setEmps(updatedEmps)
                setDate('')
                toast.success('Updated Successfully!')
            }
        })
        .catch(err => {
            toast.error(err.message)
        })
}

export const clearFilters = (setOffice, setPosition, setName, setActive) => {
    setOffice('')
    setPosition('')
    setName('')
    setActive('')
}

export const handleViewFile = (id, url) => { // when view attach file is clicked,
    Swal.fire({
        title: 'Processing request . . .',
    })
    Swal.showLoading()
    axios.post(`/api/${url}`, {
        id: id,
    },
        {
            responseType: 'blob'
        }
    )
        .then(res => {
            Swal.close()
            if (res.data.type === 'image/png' || res.data.type === 'image/jpg' || res.data.type === 'image/jpeg') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type === 'image/png' ? 'image/png' : res.data.type === 'image/jpg' ? 'image/jpg' : res.data.type === 'image/jpeg' ? 'image/jpeg' : '' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
            else if (res.data.type === 'application/pdf') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}


// ViewEmploymentStatus

export const getEmployeeStatus = (emp_no, setEmployee) => {
    axios.post(`/api/dashboard/employee_management/getEmployeeDetails`, {
        emp_no: emp_no
    })
        .then(res => {
            setEmployee(res.data.employee)
        })
        .catch(err => {
            toast.error(err.message)
        })
}

// navigators

export const handleNavigate = (item, navigate, dispatch, employeeRouteParamCall) => {
    dispatch(employeeRouteParamCall({ param: item }))
    Swal.fire({
        text: 'Redirecting, please wait . . . ',
        icon: 'info'
    })
    Swal.showLoading()
    setTimeout(() => {
        navigate(`/${process.env.REACT_APP_HOST}/homepage/view-pds/${item}`)
        Swal.close()
    }, 500)
    localStorage.setItem('pds_id', item)
}
export const handleNavigateMain = (navigate) => {
    Swal.fire({
        title: 'Redirecting page . . . ',
        icon: 'info'
    })
    Swal.showLoading()

    setTimeout(() => {
        navigate('/hris/homepage/employee-management')
        Swal.close()
    }, 500)
}

// add to employee tabel
export const handleAddToEmployeeTable = async (row, employees, setEmployees) => {
    Swal.fire({
        text: "Add to Employee table?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continue'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                text: 'Processing request, please wait . . .',
                icon: 'info'
            })
            Swal.showLoading()
            let res = await axios.post(`/api/dashboard/employee_management/storeEmployeeTable`, { data: row })
            Swal.close()
            if (res.data.status === 200) {
                toast.success('Added to Employee table!')
                let newEmp = employees.map((item, index) => {
                    if (item.hris_test_lyxs_emp_no === row.hris_test_lyxs_emp_no) {
                        return { ...item, employee_id: res.data.employee_id }
                    }
                    else {
                        return item
                    }
                })
                setEmployees(newEmp)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }
    })
}