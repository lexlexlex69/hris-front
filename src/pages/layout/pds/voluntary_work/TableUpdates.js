import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { blue, yellow, red, green } from '@mui/material/colors'
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';

// icons
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';

// toast
import { toast } from 'react-toastify'
import axios from 'axios'

// external function
import { handleViewFile, handleViewAddedFile } from '../customFunctions/CustomFunctions'

function TableUpdates(props) {

    const [toAdd, setToAdd] = useState({})
    const [toUpdate, setToUpdate] = useState({})
    const [toUpdate2, setToUpdate2] = useState(props.voluntary)
    const [toDelete, setToDelete] = useState([])
    const [toDeleteTemp2, setToDeleteTemp2] = useState(props.voluntary)
    const [choice, setChoice] = useState('')


    // decline modal
    const [reasonDecline, setReasonDecline] = useState('')
    const modalRef = useRef(null)
    const [openModal, setOpenModal] = useState(false)
    const [modalTrigger, setModalTrigger] = useState(false)
    const [modalData, setModalData] = useState('')
    const handleOpen = (items, table_name, employee_id, row_index, status, category) => {
        setModalData({
            items: items,
            table_name: table_name,
            employee_id: employee_id,
            row_index: row_index,  // if category is delete, row_index will be the item.id
            status: status,
            category: category
        })
        setModalTrigger(true)
    }
    const handleClose = () => {
        setReasonDecline('')
        setModalTrigger(false)
        setOpenModal(false)
    }
    // 

    const handleDecline = (e, data, reason) => {
        e.preventDefault()
        console.log(data)
        Swal.fire({
            text: 'proccesing request . . .',
        })
        Swal.showLoading()
        axios.post(`/api/pds/common/declineEntries`, {
            data: data,
            reason: reason,
            category: data.category
        })
            .then(res => {
                if (res.data.status === 200) {
                    toast.success('Entry marked as declined!', { autoClose: 300 })
                    let newObj = {}
                    switch (res.data.category) {
                        case 'add': {
                            Object.assign(newObj, toAdd)
                            delete newObj[data.items]
                            setToAdd(newObj)
                            let filteredUpdates = props.voluntaryUpdates.filter(item => item.row_index !== data.row_index)
                            props.setVoluntaryUpdates(filteredUpdates)
                            break
                        }
                        case 'update': {
                            Object.assign(newObj, toUpdate)
                            delete newObj[data.items]
                            setToUpdate(newObj)
                            let filteredUpdates = props.voluntaryUpdates.filter(item => item.row_index !== data.row_index)
                            props.setVoluntaryUpdates(filteredUpdates)
                            break
                        }
                        case 'delete': {
                            let newDeletedArr = toDelete.filter(item => item.id !== data.row_index)
                            setToDelete(newDeletedArr)
                            let filteredUpdates = props.voluntaryUpdates.filter(item => Number(item.row_index) !== data.row_index)
                            props.setVoluntaryUpdates(filteredUpdates)
                            break
                        }
                        default: { return }
                    }

                    handleClose()
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message, { autoClose: 1000 })
                }
                Swal.close()
            })
            .catch(err => {
                Swal.close()
                toast.error(err.message)
            })
    }

    const handleConfirmAdded = async (objId, table_name, employee_id, row_index, status) => {
        const id = toast.loading("Processing request...")
        axios.post(`/api/pds/voluntary/confirmAdded`, {
            table_name: table_name,
            employee_id: employee_id,
            row_index: row_index,
            status: status
        })
            .then(res => {
                //console.log(res)
                if (res.data.status === 200) {
                    toast.update(id, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 300, });
                    let newObj = {}
                    Object.assign(newObj, toAdd)
                    delete newObj[objId]
                    setToAdd(newObj)
                    let filteredUpdates = props.voluntaryUpdates.filter(item => item.row_index !== row_index)
                    props.setVoluntaryUpdates(filteredUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(id, { render: res.data.message, type: "error", isLoading: false, autoClose: 1000, });
                }
            })
            .catch(err => {
                toast.update(id, { render: err.message, type: "error", isLoading: false, autoClose: 1000, });
                //console.log(err.message)
            })
    }

    const handleConfirmUpdate = (id, data_id, employee_id, row_index, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/voluntary/confirmUpdate`, {
            id: id,
            data_id: data_id,
            employee_id: employee_id,
            row_index: row_index,
            status: status
        })
            .then(res => {
                // console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 300, });
                    let newObj = {}
                    Object.assign(newObj, toUpdate)
                    delete newObj[id]
                    setToUpdate(newObj)
                    let filteredUpdates = props.voluntaryUpdates.filter(item => item.row_index !== row_index)
                    props.setVoluntaryUpdates(filteredUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: res.data.message, type: "error", isLoading: false, autoClose: 1000, });
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 300, });
                //console.log(err)
            })

    }

    const handleConfirmDeleted = (employee_id, id, status) => {
        //console.log(employee_id, id, '3')

        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/voluntary/confirmDeleted`, {
            employee_id: employee_id,
            id: id,
            status: '3',
        })
            .then(res => {
                //console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 300, });
                    let newDeletedArr = toDelete.filter(item => item.id !== id)
                    setToDelete(newDeletedArr)
                    let filteredUpdates = props.voluntaryUpdates.filter(item => Number(item.row_index) !== id)
                    props.setVoluntaryUpdates(filteredUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: res.data.message, type: "error", isLoading: false, autoClose: 1000, });

                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "error", isLoading: false, autoClose: 1000, });
                //console.log(err)
            })
    }

    const removeAdded = (objId, table_name, employee_id, row_index, status) => {
        const id = toast.loading("Processing request...")
        axios.post(`/api/pds/voluntary/removeAdded`, {
            table_name: table_name,
            employee_id: employee_id,
            row_index: row_index,
            status: status
        })
            .then(res => {
                if (res.data.status === 200) {
                    toast.update(id, { render: "Item removed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newObj = {}
                    Object.assign(newObj, toAdd)
                    delete newObj[objId]
                    setToAdd(newObj)
                    let filteredUpdates = props.voluntaryUpdates.filter(item => item.row_index !== row_index)
                    props.setVoluntaryUpdates(filteredUpdates)
                }
            })
            .catch(err => {
                toast.update(id, { render: err.message, type: "error", isLoading: false, autoClose: 2000, });
                //console.log(err.message)
            })
    }

    const removeUpdated = (id, data_id, employee_id, row_index, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/voluntary/removeUpdated`, {
            id: id,
            data_id: data_id,
            employee_id: employee_id,
            row_index: row_index,
            status: status
        })
            .then(res => {
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Item removed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newObj = {}
                    Object.assign(newObj, toUpdate)
                    delete newObj[id]
                    setToUpdate(newObj)
                    let filteredUpdates = props.voluntaryUpdates.filter(item => item.row_index !== row_index)
                    props.setVoluntaryUpdates(filteredUpdates)
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 2000, });
                //console.log(err)
            })
    }

    const removeDeleted = (employee_id, id, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/voluntary/removeDeleted`, {
            employee_id: employee_id,
            id: id,
            status: '3'
        })
            .then(res => {
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newDeletedArr = toDelete.filter(item => item.id !== id)
                    setToDelete(newDeletedArr)
                    let filteredUpdates = props.voluntaryUpdates.filter(item => Number(item.row_index) !== id)
                    props.setVoluntaryUpdates(filteredUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: "Something went wrong!", type: "error", isLoading: false, autoClose: 2000, });

                }
            })
            .catch(err => {
                toast.update(toastId, { render: "Something went wrong!", type: "error", isLoading: false, autoClose: 2000, });
                //console.log(err)
            })
    }

    useEffect(() => {
        let toAddTemp = props.voluntaryUpdates.filter(item => item.status === 2)
        let toUpdateTemp = props.voluntaryUpdates.filter(item => item.status === 0)
        let toDeleteTemp = props.voluntaryUpdates.filter(item => item.status === 3)
        function groupBy(array, property) {
            var hash = {};
            for (var i = 0; i < array.length; i++) {
                if (!hash[array[i][property]]) hash[array[i][property]] = [];
                hash[array[i][property]].push(array[i]);
            }
            return hash;
        }
        let arrayToSort = groupBy(toAddTemp, 'row_index')
        Object.keys(arrayToSort).map((item, index) => { // arrange the object array base on the value of table_field
            arrayToSort[item].sort((a, b) => {
                let fa = a.table_field.toLowerCase(), fb = b.table_field.toLowerCase();
                if (fa < fb) {
                    return -1
                }
                if (fa > fb) {
                    return 1
                }
                return 0
            })
        })
        setToAdd(arrayToSort)
        // setToAdd(groupBy(toAddTemp, 'row_index'))
        setToUpdate(groupBy(toUpdateTemp, 'row_index'))

        let newToDeleteTemp = [] // code below to store to delete states and temporary delete state
        toDeleteTemp.map((item) => {
            toDeleteTemp2.map((items) => {
                if (Number(item.row_index) === items.id) {
                    //console.log(item.row_index, items.id)
                    newToDeleteTemp.push(items)
                }
            })
            setToDelete(newToDeleteTemp)
        })
    }, [])

    // decline modal
    useEffect(() => {
        if (modalRef.current) {
            modalRef.current = false
        }
        else {
            if (modalTrigger) {
                setOpenModal(true)
            }
        }
    }, [modalTrigger])

    return (
        <Box sx={{ mt: 2, height: '100%', overflowY: 'scroll' }}>
            {/* decline */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        bgcolor: 'background.paper',
                        border: `4px  solid ${red[500]}`,
                        borderRadius: '1.5rem',
                        p: 4,
                        pt: 2,

                    }}>
                        <form onSubmit={(e) => handleDecline(e, modalData, reasonDecline)} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                            <Box display="flex" justifyContent='flex-end' mb={2}>
                                <CloseIcon sx={{ color: 'error.main', cursor: 'pointer' }} onClick={handleClose} />
                            </Box>
                            <TextField required fullWidth variant='outlined' multiline rows={4} value={reasonDecline} label='Reason for declining entry' onChange={(e) => setReasonDecline(e.target.value)} />
                            <Box>
                                <Button variant='contained' type="submit" sx={{ borderRadius: '1.5rem', mt: 3 }}>submit</Button>
                            </Box>
                        </form>
                    </Box>
                </Fade>
            </Modal>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant={choice === 'added' ? 'contained' : 'outlined'} size="small" sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }} disabled={Object.keys(toAdd).length > 0 ? false : true} startIcon={<AddCircleIcon />} onClick={() => setChoice('added')}>added</Button>
                <Button variant={choice === 'updated' ? 'contained' : 'outlined'} size="small" disabled={Object.keys(toUpdate).length > 0 ? false : true} color="warning" startIcon={<EditRoundedIcon />} onClick={() => setChoice('updated')}>updated</Button>
                <Button variant={choice === 'deleted' ? 'contained' : 'outlined'} size="small" disabled={Object.keys(toDelete).length > 0 ? false : true} color="error" startIcon={<HighlightOffIcon />} onClick={() => setChoice('deleted')}>deleted</Button>
            </Box>
            <Box sx={{ mt: 1 }}>
                {choice === 'added' ?
                    (
                        <Fade in>
                            <Box >
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}></TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>NAME AND ADDRESS OF ORGANIZATION</TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>From</TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>TO</TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>NUMBER OF HOURS</TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>POSITION / NATURE OF WORK</TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>ATTACHED FILE</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.keys(toAdd).map((items, index) => (
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row" align="left">
                                                        {!props.pdsParam.id && localStorage.getItem('hris_roles') !== '1' && props.voluntaryUpdates.length > 0 ? (
                                                            <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => removeAdded(items, toAdd[items][0].table_name, toAdd[items][0].employee_id, toAdd[items][0].row_index, toAdd[items][0].status)}>remove</Button>
                                                        ) : (
                                                            <Box display='flex' flexDirection='column'>
                                                                <Button sx={{ mt: 1 }} variant="outlined" color="success" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmAdded(items, toAdd[items][0].table_name, toAdd[items][0].employee_id, toAdd[items][0].row_index, toAdd[items][0].status)}>approve</Button>
                                                                <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => handleOpen(items, toAdd[items][0].table_name, toAdd[items][0].employee_id, toAdd[items][0].row_index, toAdd[items][0].status, 'add')} >decline</Button>
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][5].new_value ? toAdd[items][5].new_value : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][0].new_value ? toAdd[items][0].new_value : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][1].new_value ? toAdd[items][1].new_value : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][4].new_value ? toAdd[items][4].new_value : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][6].new_value ? toAdd[items][6].new_value : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][3].new_value ? (
                                                            <Tooltip title="view attached file">
                                                                <Button variant="outlined" size="small" onClick={() => handleViewAddedFile(toAdd[items][3].id, 'voluntary/viewAddedAttachFile')}>view file</Button>
                                                            </Tooltip>
                                                        ) : 'no File'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Fade>
                    )
                    : choice === 'updated' ?
                        (
                            <Fade in>
                                <div sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableBody>
                                                {Object.keys(toUpdate).map((items, index) => (
                                                    <TableRow key={index} size="small">
                                                        <TableCell width="100%" key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    NAME AND ADDRESS OF ORGANIZATION
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    FROM
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    TO
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    NUMBER OF HOURS
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    POSITION / NATURE OF WORK
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    Attached File
                                                                                </Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).organization}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).datefrom}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).dateto}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).nohours}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).positionwork}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).file_path ? (
                                                                                    <Tooltip title="view attached file">

                                                                                        <Button variant="outlined" size="small" onClick={() => handleViewFile(
                                                                                            toUpdate2 && toUpdate2.find(x => {
                                                                                                if (Number(x.id) === Number(items))
                                                                                                    return x
                                                                                            }).id, 'voluntary/viewAttachFile')}>view file</Button>
                                                                                    </Tooltip>
                                                                                ) : 'no attached file'}

                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1, bgcolor: yellow[100], p: 1 }}>
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    {toUpdate[items].map((item, index) => (
                                                                        <React.Fragment key={index}>
                                                                            {index === 0 ? (
                                                                                <Box size="small">
                                                                                    {!props.pdsParam.id && localStorage.getItem('hris_roles') !== '1' && props.voluntaryUpdates.length > 0 ? (
                                                                                        <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => removeUpdated(items, item.id, item.employee_id, item.row_index, item.status)}>remove</Button>
                                                                                    ) : (
                                                                                        <Box display="flex" flexDirection='column'>
                                                                                            <Button sx={{ mt: 1 }} variant="outlined" color="success" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmUpdate(items, item.id, item.employee_id, item.row_index, item.status)}>approve</Button>
                                                                                            <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => handleOpen(items, item.table_name, item.employee_id, item.row_index, item.status, 'update')} >decline</Button>
                                                                                        </Box>
                                                                                    )}
                                                                                </Box>
                                                                            ) : null}
                                                                            <Box key={index} sx={{ flex: 1 }}>
                                                                                {item.table_field === 'rowId' || item.table_field === 'ext' || item.table_field === 'order' ? null : item.table_field === 'file_path' ? (
                                                                                    <>
                                                                                        {item.new_value ? (
                                                                                            <Box className='table-updates-view-files'>
                                                                                                <Typography sx={{ textAlign: 'center', color: 'warning.main' }}>file</Typography>
                                                                                                <Tooltip title="view attached file">
                                                                                                    <Button variant="contained" size="small" onClick={() => handleViewAddedFile(item.id, 'education/viewAddedAttachFile')}>view file</Button>
                                                                                                </Tooltip>
                                                                                            </Box>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Typography sx={{ textAlign: 'center', color: 'warning.main' }}>file</Typography>
                                                                                                <Typography sx={{ textAlign: 'center', color: '#5c5c5c' }}> no attached file</Typography>
                                                                                            </>
                                                                                        )}

                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Typography sx={{ textAlign: 'center', color: 'warning.main', fontSize: '.7rem' }}>{item.table_field === 'organization' ? "NAME AND ADDRESS OF ORGANIZATION" : item.table_field === 'datefrom' ? 'FROM' : item.table_field === 'dateto' ? 'TO' : item.table_field === 'nohrs' ? 'NUMBER OF HOURS' : item.table_field === 'positionwork' ? 'POSITION / NATURE OF WORK' : ''}</Typography>
                                                                                        <Typography sx={{ textAlign: 'center' }}>{item.new_value}</Typography>
                                                                                    </>
                                                                                )}
                                                                            </Box>
                                                                        </React.Fragment>

                                                                    ))}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>

                                                    </TableRow>
                                                ))}

                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </Fade>
                        )
                        : choice === 'deleted' ?
                            (
                                <Fade in>
                                    <Box>
                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table" size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            NAME AND ADDRESS OF ORGANIZATION
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            FROM
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            TO
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            NUMBER OF HOURS
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            POSITION / NATURE OF WORK
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            ATTACHED FILE
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {toDelete.map((item, index) => (
                                                        <TableRow key={index} sx={{ mt: 1 }}>
                                                            <TableCell>
                                                                {!props.pdsParam.id && localStorage.getItem('hris_roles') !== '1' && props.voluntaryUpdates.length > 0 ? (
                                                                    <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => removeDeleted(item.employee_id, item.id, item.status)}>remove</Button>
                                                                ) : (
                                                                    <>
                                                                        <Button sx={{ mt: 1 }} variant="outlined" color="success" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmDeleted(item.employee_id, item.id, item.status)}>approve</Button>
                                                                        <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => handleOpen(undefined, undefined, item.employee_id, item.id, item.status, 'delete')} >decline</Button>
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography>{item.organization}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.datefrom}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.dateto}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.nohours}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.positionwork}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button variant="outlined" size="small" onClick={() => handleViewFile(item.id, 'voluntary/viewAttachFile')}>
                                                                    view file
                                                                </Button>
                                                                {/* {item.file_path} */}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Fade>
                            ) : (
                                <Box>
                                    <Typography>Disabled buttons means no available update.</Typography>
                                </Box>
                            )
                }
            </Box>
        </Box>
    )
}

export default React.memo(TableUpdates)