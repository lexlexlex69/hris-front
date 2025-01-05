import React, { useState, useEffect, useRef } from 'react'
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
import { red, yellow } from '@mui/material/colors'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ClearAllIcon from '@mui/icons-material/ClearAll';
import TourIcon from '@mui/icons-material/Tour';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import ProccessSvg from '../../../../assets/img/processsvg.svg'

import { handleViewFile } from './Controller'

function ViewHistory({ item }) {
    const [history, setHistory] = useState('')

    const onChangeDate = (id,d) => {
        Swal.fire({
            text: 'updating, please wait . . .',
            icon: 'info'
        })
        Swal.showLoading()
        axios.post(`/api/dashboard/employee_management/updateEffectiveDate`, {
            id: id,
            effective_date: d
        }).then(res => {
            Swal.close()
            if(res.data.status === 200)
            {
                toast.success('Updated Successfully!')
                let updatedHistory = history.map( x => x.id === id ? {...x,date_transfered : d} : x)
                setHistory(updatedHistory)
            }

        })
            .catch(err => {
            Swal.close()
                toast.error(err.message)
                console.log(err)
            })
    }
    useEffect(() => {
        console.log(item.emp_no)
        axios.post(`/api/dashboard/employee_management/viewHistoryDetails`, {
            emp_no: item.emp_no
        })
            .then(res => {
                console.log(res)
                setHistory(res.data.details)
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <Box>
            <Typography color="primary">{item.emp_fname} {item.emp_mname} {item.emp_lname}</Typography>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="cgb-color-table" sx={{ color: '#fff' }}>Date of Effectivity</TableCell>
                            <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="center">Original Office</TableCell>
                            <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="center">Assigned Office</TableCell>
                            <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="center">Attachment/memo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history ? (
                            <>
                                {history.map((row, index) => (
                                    <Fade in key={index}>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: row.new_dept_id === row.old_dept_id ? red[300] : 'none' }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.date_transfered ? row.date_transfered : (
                                                    <TextField type='date' label="update date of effective re-assignment" variant='outlined' focused onChange={(e) => onChangeDate(row.id,e.target.value)} />
                                                )}
                                            </TableCell>
                                            <TableCell align="center">{row.old_dept_title}</TableCell>
                                            <TableCell align="center">{row.new_dept_title}</TableCell>
                                            <TableCell align="center"><AttachFileIcon onClick={() => handleViewFile(row.id, 'dashboard/employee_management/viewAttachFile')} sx={{ cursor: 'pointer' }} /></TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </>
                        ) : (
                            <>
                                {Array.from(Array(5)).map((item, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Skeleton width="100%" height={25} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Skeleton width="100%" height={25} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Skeleton width="100%" height={25} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Skeleton width="100%" height={25} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>

                        )}

                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default ViewHistory