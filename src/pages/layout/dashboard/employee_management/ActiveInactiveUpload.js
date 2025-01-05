import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import {red} from '@mui/material/colors';

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ClearAllIcon from '@mui/icons-material/ClearAll';
import TourIcon from '@mui/icons-material/Tour';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import { convertTo64 } from '../../pds/customFunctions/CustomFunctions'

function ActiveInactiveUpload({ data, employees, setEmployees, handleCloseActive }) {
    const [activeFileUpload, setActiveFileUpload] = useState('')
    const [dateApply,setDateApply] = useState('')
    const [dateEffective,setDateEffective] = useState('')
    console.log('data',data)

    const handleActive = async (e) => {
        e.preventDefault()
        Swal.fire('please wait . . .')
        Swal.showLoading()
        let localStatus = data.inactive === 0 ? 1 : 0
        let isFile = await convertTo64(activeFileUpload)
        axios.get(`https://test.butuan.gov.ph/joe_test_api/HRIS/api/getEmpStat/${data.emp_no}/${localStatus}/b9e1f8a0553623f1:639a3e:17f68ea536b`)
            .then(res => {
                console.log(res)
                if (res.data.code === '200') {
                    let filterEmp = employees.map(x => x.emp_no === data.emp_no ? {...x,inactive: localStatus,date_inactive_apply: dateApply} : x)
                    setEmployees(filterEmp)
                    return axios.post(`/api/dashboard/employee_management/updateStatus`, {
                        emp_no: data.emp_no,
                        status: localStatus,
                        filer: isFile,
                        date_apply: dateApply,
                        date_effective: dateEffective
                    })
                }
            })
            .then(res => {
                Swal.close()
                console.log(res)
                if (res.data.status === 200) {
                    handleCloseActive()
                }
            }
            )
            .catch(err => {
                Swal.close()
                console.log(err)
                toast.error(err.message)
            })
    }
    
    return (
        <Box>
            <form onSubmit={handleActive} style={{display:'flex',flexDirection:'column',gap:2}}>
                <Typography sx={{color:red[400]}} align="center">De-activating/Activating employee requires attachment/memo</Typography>
                <TextField required type='date' focused label="Date of Application" value={dateApply} onChange={(e) => setDateApply(e.target.value)} sx={{mt:1}} />
                <TextField type='date' focused label="Date of Effectivity" value={dateEffective} onChange={(e) => setDateEffective(e.target.value)} sx={{mt:1}} />
                <TextField required type='file' onChange={(e) => setActiveFileUpload(e.target.files[0])} sx={{mt:1}} />
                <Button sx={{mt:1}} variant='contained' type="submit" >Submit</Button>
            </form>

        </Box>
    )
}

export default ActiveInactiveUpload