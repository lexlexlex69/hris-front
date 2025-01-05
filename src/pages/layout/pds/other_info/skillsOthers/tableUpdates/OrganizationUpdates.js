import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red, yellow } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Swal from 'sweetalert2'
import axios from 'axios';
import { toast } from 'react-toastify'
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

function OrganizationUpdates(props) {
    const [choice, setChoice] = useState('added')
    const [toAdd, setToAdd] = useState([])
    const [toUpdate, setToUpdate] = useState([])
    const [toDelete, setToDelete] = useState([])
    const toDeleteTemp2 = props.organization

    const confirmAdded = (item) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/confirmOthersAdded`, { item: item })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes approved!", type: "success", isLoading: false, autoClose: 300, });
                    let newToAdd = toAdd.filter(data => data.id !== item.id)
                    setToAdd(newToAdd)
                    let filterData = props.data.filter(data => data.id !== item.id)
                    props.setData(filterData)
                    let filterUpdates = props.updates.filter(data => data.id !== item.id)
                    props.setUpdates(filterUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: res.data.message, type: "error", isLoading: false, autoClose: 1000, });
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 1000, });
                console.log(err)
            })
    }

    const confirmUpdated = (item) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/confirmOthersUpdated`, { item: item })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes approved!", type: "success", isLoading: false, autoClose: 300, });
                    let newToUpdate = toUpdate.filter(data => data.id !== item.id)
                    setToUpdate(newToUpdate)
                    let filterData = props.data.filter(data => data.id !== item.id)
                    props.setData(filterData)
                    let filterUpdates = props.updates.filter(data => data.id !== item.id)
                    props.setUpdates(filterUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: res.data.message, type: "error", isLoading: false, autoClose: 1000, });
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 1000, });
                console.log(err)
            })
    }

    const confirmDeleted = (item) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/confirmOthersDeleted`, { item: item })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes approved!", type: "success", isLoading: false, autoClose: 300, });
                    let newToDelete = toDelete.filter(data => data.info_id !== item.info_id)
                    setToDelete(newToDelete)
                    let filterData = props.data.filter(data => data.id !== item.info_id)
                    props.setData(filterData)
                    let filterUpdates = props.updates.filter(data => data.id !== item.info_id)
                    props.setUpdates(filterUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: res.data.message, type: "error", isLoading: false, autoClose: 1000, });
                }

            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 1000, });
                console.log(err)
            })
    }

    const removeAdded = (item) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/removeOthersAdded`, { item: item })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes approved!", type: "success", isLoading: false, autoClose: 2000, });
                    let newToAdd = toAdd.filter(data => data.id !== item.id)
                    setToAdd(newToAdd)
                    let filterData = props.data.filter(data => data.id !== item.id)
                    props.setData(filterData)
                    let filterUpdates = props.updates.filter(data => data.id !== item.id)
                    props.setUpdates(filterUpdates)
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 2000, });
                console.log(err)
            })
    }

    const removeUpdated = (item) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/removeOthersUpdated`, { item: item })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes approved!", type: "success", isLoading: false, autoClose: 2000, });
                    let newToUpdate = toUpdate.filter(data => data.id !== item.id)
                    setToUpdate(newToUpdate)
                    let filterData = props.data.filter(data => data.id !== item.id)
                    props.setData(filterData)
                    let filterUpdates = props.updates.filter(data => data.id !== item.id)
                    props.setUpdates(filterUpdates)
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 2000, });
                console.log(err)
            })
    }

    const removeDeleted = (item) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/removeOthersDeleted`, { item: item })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes approved!", type: "success", isLoading: false, autoClose: 2000, });
                    let newToDelete = toDelete.filter(data => data.info_id !== item.info_id)
                    setToDelete(newToDelete)
                    let filterData = props.data.filter(data => data.id !== item.info_id)
                    props.setData(filterData)
                    let filterUpdates = props.updates.filter(data => data.id !== item.info_id)
                    props.setUpdates(filterUpdates)
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 2000, });
                console.log(err)
            })
    }

    useEffect(() => {
        let toadd = props.data.filter(item => item.status === 2)
        let toupdate = props.data.filter(item => item.status === 0)
        let todelete = props.data.filter(item => item.status === 3)
        setToAdd(toadd)
        setToUpdate(toupdate)
        let newToDeleteTemp = [] // code below to store to delete states and temporary delete state
        todelete.map((item) => {
            toDeleteTemp2.map((items) => {
                if (Number(item.row_index) === items.id) {
                    items.info_id = item.id
                    newToDeleteTemp.push(items)
                }
            })
            setToDelete(newToDeleteTemp)
        })

    }, [])
    return (
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                <Button variant={choice === 'added' ? 'contained' : 'outlined'} color="success" size="small" disabled={toAdd && toAdd.length <= 0 ? true : false} onClick={() => setChoice('added')} sx={{ color: choice === 'added' ? '#fff' : 'success.main' }}>Added</Button>
                <Button variant={choice === 'updated' ? 'contained' : 'outlined'} color="warning" size="small" disabled={toUpdate && toUpdate.length <= 0 ? true : false} onClick={() => setChoice('updated')}>Updated</Button>
                <Button variant={choice === 'deleted' ? 'contained' : 'outlined'} color="error" size="small" disabled={toDelete && toDelete.length <= 0 ? true : false} onClick={() => setChoice('deleted')}>Deleted</Button>
            </Box>
            <Box sx={{ mt: 1 }}>
                {choice === 'added' ? (
                    <Box>
                        <TableContainer component={Paper} sx={{ maxHeight: '20rem' }}>
                            <Table aria-label="simple table" size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='cgb-color-table table-font-size'></TableCell>
                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>Special Skills</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {toAdd && toAdd.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" width="20%">
                                                {localStorage.getItem('hris_roles') !== '1' && !props.pdsParam.id && props.data.length > 0 ?
                                                    (
                                                        <Button variant='outlined' size="small" startIcon={<DoDisturbIcon />} color="error" onClick={() => removeAdded(item)}>remove</Button>
                                                    ) :
                                                    (
                                                        <Button variant='outlined' size="small" onClick={() => confirmAdded(item)}>Approve</Button>
                                                    )}
                                            </TableCell>
                                            <TableCell align="left" className="table-font-size">{item.new_value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) :
                    choice === 'updated' ? (
                        <Box>
                            <TableContainer component={Paper} sx={{ maxHeight: '20rem' }}>
                                <Table aria-label="simple table" size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='cgb-color-table table-font-size'></TableCell>
                                            <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>New Entry</TableCell>
                                            <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>Old Entry</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {toUpdate && toUpdate.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" width="20%">
                                                    {localStorage.getItem('hris_roles') !== '1' && !props.pdsParam.id && props.data.length > 0 ?
                                                        (
                                                            <Button variant='outlined' size="small" color='error' startIcon={<DoDisturbIcon />} onClick={() => removeUpdated(item)}>remove</Button>
                                                        ) :
                                                        (
                                                            <Button variant='outlined' size="small" onClick={() => confirmUpdated(item)}>Approve</Button>
                                                        )}
                                                </TableCell>
                                                <TableCell align="left" className="table-font-size" sx={{ color: 'primary.main' }}>{item.new_value}</TableCell>
                                                <TableCell align="left" className="table-font-size" sx={{ color: 'warning.main' }}>{item.old_value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ) :
                        choice === 'deleted' ? (
                            <Box>
                                <TableContainer component={Paper} sx={{ maxHeight: '20rem' }}>
                                    <Table aria-label="simple table" size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='cgb-color-table table-font-size'></TableCell>
                                                <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>Special Skills</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {toDelete && toDelete.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row" width="20%">
                                                        {localStorage.getItem('hris_roles') !== '1' && !props.pdsParam.id && props.data.length > 0 ?
                                                            (
                                                                <Button variant='outlined' size="small" color="error" startIcon={<DoDisturbIcon />} onClick={() => removeDeleted(item)}>remove</Button>
                                                            ) :
                                                            (
                                                                <Button variant='outlined' size="small" onClick={() => confirmDeleted(item)}>Approve</Button>
                                                            )}
                                                    </TableCell>
                                                    <TableCell align="left" className="table-font-size" sx={{ color: 'error.main' }}>{item.description}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        ) : null
                }
            </Box>
        </Box>
    )
}

export default React.memo(OrganizationUpdates)