import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { blue, orange } from '@mui/material/colors'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip';

import axios from 'axios'
import { toast } from 'react-toastify';

import PersonnelSelect from './PersonnelSelect';
import CommonBackdrop from '../../../../../common/Backdrop';
import { Skeleton } from '@mui/material';
import Swal from 'sweetalert2';

const Personnels = ({ open, setOpen, orgId }) => {
    const [personnel, setPersonnel] = useState({
        id: '',
        fullname: ''
    })
    const [backdropTitle,setBackdropTitle] = useState('')
    const [personnelList, setPersonnelList] = useState([])
    // backdrop
    const [cBd, setCBd] = useState(false)
    const [loader, setLoader] = useState(true)

    // functions
    const handleAddEmployee = async (e) => {
        e.preventDefault()
        setBackdropTitle('Adding employee . . .')
        setCBd(true)
        if (!personnel.id) {
            toast.warning('')
            return
        }
        let res = await axios.post(`/api/dashboard/employee_management/add-employee`, { personnel: personnel, org_id: orgId })
        console.log(res)
        if (res.data.status === 200) {
            setPersonnelList(prev => [...prev, res.data.employee])
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message, {
                position: "top-center",
            })
        }
        setCBd(false)
    }

    const getEmployees = async (controller) => {
        setLoader(true)
        let res = await axios.get(`/api/dashboard/employee_management/employee-list?org_id=${orgId}`, { signal: controller.signal })
        console.log(res)
        setPersonnelList(res.data)
        setLoader(false)
    }

    const removeEmployee = async (employee, orgId) => {
        Swal.fire({
            text: "Remove employee!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setBackdropTitle('Removing employee . . .')
                setCBd(true)
                let res = await axios.post(`/api/dashboard/employee_management/remove-employee`, { employee_id: employee.id, org_id: orgId })
                console.log(res)
                if (res.data.status === 200) {
                    let filteredList = personnelList.filter((item) => item.id !== employee.id)
                    setPersonnelList(filteredList)
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message, {
                        position: 'top-center'
                    })
                }
                setCBd(false)
            }
        })
    }

    useEffect(() => {
        let controller = new AbortController()
        getEmployees(controller)
        return (() => controller.abort())
    }, [])

    return (
        <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(10%,0%)', zIndex: 2000, width: '20rem', height: '30rem', borderRadius: 1, display: open ? 'block' : 'none', transition: 'all .5s',boxShadow: `2px 10px 15px 2px ${orange[100]}`, bgcolor: '#fff', '&:hover': { zIndex: 2000, boxShadow: `2px 10px 15px 2px ${orange[300]}` }, zIndex: 900, cursor: 'pointer', pb: 2, pt: 1, px: 1 }}>
            <CommonBackdrop open={cBd} setOpen={setCBd} title={backdropTitle} />
            <Tooltip title="close">
                <CloseIcon sx={{ float: 'right' }} color='error' onClick={() => setOpen(false)} />
            </Tooltip>
            <Box>
                <Typography variant="body1" color="primary" align='center'>Personnel</Typography>
                <form onSubmit={handleAddEmployee}>
                    <Box display='flex' gap={1} mt={1}>
                        <PersonnelSelect url="/api/dashboard/employee_management/search-employee" optionTitle='fullname' componentTitle='Search employee' setTitle={setPersonnel} />
                        <Tooltip title="add employee">
                            <Button type='submit'>
                                <AddIcon sx={{ fontSize: 35, cursor: 'pointer', alignSelf: 'center' }} color='primary' />
                            </Button>
                        </Tooltip>
                    </Box>
                </form>
            </Box>
            <hr />
            <Box display='flex' flexDirection='column' gap={2} sx={{ overflowY: 'scroll', height: '20rem' }}>
                {loader ? (
                    <Box sx={{ px: 2 }}>
                        {Array.from(Array(10)).map((item, i) => (
                            <Box key={i}>
                                <Skeleton variant='text' sx={{ my: .5 }} />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <>
                        {personnelList.length ? personnelList.map((item, i) => (
                            <Box key={i} px={2} display='flex' justifyContent='space-between' alignItems='center'>
                                <Typography fontSize={item?.fullname?.length > 25 ? '10px' : '12px'}>{item?.fullname}</Typography>
                                <Tooltip title="remove">
                                    <DeleteIcon color='error' sx={{ cursor: 'pointer' }} onClick={() => removeEmployee(item, orgId)} />
                                </Tooltip>
                            </Box>
                        )) : ''}
                    </>
                )}

            </Box>
        </Box>
    );
};

export default React.memo(Personnels);