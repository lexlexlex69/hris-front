import React, { useState, useEffect } from 'react'
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
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { blue, yellow, red, green } from '@mui/material/colors'
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// icons
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { faCoffee, faFileAlt, faCertificate, faCircleInfo, faFile, faPencil } from '@fortawesome/free-solid-svg-icons'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

// toast
import { toast } from 'react-toastify'
import axios from 'axios'

// external function
import { handleViewFile } from '../../customFunctions/CustomFunctions'

function TableUpdates(props) {

    const [toAdd, setToAdd] = useState({})
    const [toUpdate, setToUpdate] = useState({})
    const [toUpdate2, setToUpdate2] = useState(props.references)
    const [toDelete, setToDelete] = useState([])
    const [toDeleteTemp2, setToDeleteTemp2] = useState(props.references)
    const [choice, setChoice] = useState('')

    const handleConfirmAdded = async (objId, table_name, employee_id, row_index, status) => {
        const id = toast.loading("Processing request...")
        axios.post(`/api/pds/others/confirmAddedReferences`, {
            table_name: table_name,
            employee_id: employee_id,
            row_index: row_index,
            status: status
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(id, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 300, });
                    let newObj = {}
                    Object.assign(newObj, toAdd)
                    delete newObj[objId]
                    setToAdd(newObj)
                    let filteredUpdates = props.referencesUpdates.filter(item => item.row_index !== row_index)
                    props.setReferencesUpdates(filteredUpdates)
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
        //console.log(id, data_id, row_index)
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/confirmUpdatedReferences`, {
            id: id,
            data_id: data_id,
            employee_id: employee_id,
            row_index: row_index,
            status: status
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 300, });
                    let newObj = {}
                    Object.assign(newObj, toUpdate)
                    delete newObj[id]
                    setToUpdate(newObj)
                    let filteredUpdates = props.referencesUpdates.filter(item => item.row_index !== row_index)
                    props.setReferencesUpdates(filteredUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: res.data.message, type: "error", isLoading: false, autoClose: 1000, });
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 1000, });
                //console.log(err)
            })

    }

    const handleConfirmDeleted = (employee_id, id, status) => {
        //console.log(employee_id, id, '3')

        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/confirmDeletedReferences`, {
            employee_id: employee_id,
            id: id,
            status: '3',
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 300, });
                    let newDeletedArr = toDelete.filter(item => item.id !== id)
                    setToDelete(newDeletedArr)
                    let filteredUpdates = props.referencesUpdates.filter(item => Number(item.row_index) !== id)
                    props.setReferencesUpdates(filteredUpdates)
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
        axios.post(`/api/pds/others/removeAddedReferences`, {
            table_name: table_name,
            employee_id: employee_id,
            row_index: row_index,
            status: status
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(id, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newObj = {}
                    Object.assign(newObj, toAdd)
                    delete newObj[objId]
                    setToAdd(newObj)
                    let filteredUpdates = props.referencesUpdates.filter(item => item.row_index !== row_index)
                    props.setReferencesUpdates(filteredUpdates)
                }
            })
            .catch(err => {
                toast.update(id, { render: err.message, type: "error", isLoading: false, autoClose: 2000, });
                //console.log(err.message)
            })
    }

    const removeUpdated = (id, data_id, employee_id, row_index, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/removeUpdatedReferences`, {
            id: id,
            data_id: data_id,
            employee_id: employee_id,
            row_index: row_index,
            status: status
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newObj = {}
                    Object.assign(newObj, toUpdate)
                    delete newObj[id]
                    setToUpdate(newObj)
                    let filteredUpdates = props.referencesUpdates.filter(item => item.row_index !== row_index)
                    props.setReferencesUpdates(filteredUpdates)
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 2000, });
                //console.log(err)
            })
    }

    const removeDeleted = (employee_id, id, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/removeDeletedReferences`, {
            employee_id: employee_id,
            id: id,
            status: '3',
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newDeletedArr = toDelete.filter(item => item.id !== id)
                    setToDelete(newDeletedArr)
                    let filteredUpdates = props.referencesUpdates.filter(item => Number(item.row_index) !== id)
                    props.setReferencesUpdates(filteredUpdates)
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
        let toAddTemp = props.referencesUpdates.filter(item => item.status === 2)
        let toUpdateTemp = props.referencesUpdates.filter(item => item.status === 0)
        let toDeleteTemp = props.referencesUpdates.filter(item => item.status === 3)
        //console.log('updated', toUpdateTemp)
        //console.log('deleted', toDeleteTemp)
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
        console.log(arrayToSort)
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
        //console.log('toUpdate2', toUpdate2)
    }, [])
    return (
        <Box sx={{ mt: 2 }}>
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
                                    <Table aria-label="simple table" size="small" sx={{ width: '100%' }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}></TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>NAME</TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>ADDRESS</TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>TEL NO.</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.keys(toAdd).map((items, index) => (
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row" align="left">
                                                        {!props.pdsParam.id && localStorage.getItem('hris_roles') !== '1' && props.referencesUpdates.length > 0 ? (
                                                            <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => removeAdded(items, toAdd[items][0].table_name, toAdd[items][0].employee_id, toAdd[items][0].row_index, toAdd[items][0].status)}>remove</Button>
                                                        ) : (
                                                            <Button sx={{ mt: 1 }} variant="outlined" color="success" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmAdded(items, toAdd[items][0].table_name, toAdd[items][0].employee_id, toAdd[items][0].row_index, toAdd[items][0].status)}>approve</Button>
                                                        )}
                                                        {/* <Button sx={{ mt: 1 }} variant="contained" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmAdded(items, item.table_name, item.employee_id, item.row_index, item.status)}>confirm</Button> */}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][1].new_value ? toAdd[items][1].new_value : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][0].new_value ? toAdd[items][0].new_value : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toAdd[items][2].new_value ? toAdd[items][2].new_value : ''}
                                                    </TableCell>
                                                    {/* {toAdd[items].map((item, index) => (
                                                        <React.Fragment key={index} >
                                                            {index === 0 ? (
                                                                <TableCell component="th" scope="row" align="left">
                                                                    <Button sx={{ mt: 1 }} variant="contained" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmAdded(items, item.table_name, item.employee_id, item.row_index, item.status)}>confirm</Button>
                                                                </TableCell>
                                                            ) : null}

                                                            <TableCell component="th" scope="row" align="left">
                                                                {item.table_field === 'rowId' || item.table_field === 'ext' || item.table_field === 'order' ? null : item.table_field === 'file_path' ? (
                                                                    <>
                                                                        {item.new_value ? (
                                                                            <>
                                                                                <Tooltip title="view attached file">
                                                                                    <Button variant="outlined" size="small" onClick={() => handleViewFile(item.id, 'trainings/viewAddedAttachFile')}>view file</Button>
                                                                                </Tooltip>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Typography sx={{ textAlign: 'center', color: '#5c5c5c' }}> no attached file</Typography>
                                                                            </>
                                                                        )}

                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Typography sx={{ textAlign: 'left' }}>{item.new_value}</Typography>
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                        </React.Fragment>
                                                    ))} */}
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
                                        <Table aria-label="simple table" size="small">
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
                                                                                    NAME
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    ADDRESS
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    TEL NO.
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
                                                                                }).RefName}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).RefAddress}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).RefTel}
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
                                                                                    {!props.pdsParam.id && localStorage.getItem('hris_roles') !== '1' && props.referencesUpdates.length > 0 ? (
                                                                                        <Button sx={{ mt: 1 }} variant="outlined" size="small" color="error" startIcon={<CheckCircleOutlineIcon />} onClick={() => removeUpdated(items, item.id, item.employee_id, item.row_index, item.status)}>remove</Button>
                                                                                    ) : (
                                                                                        <Button sx={{ mt: 1 }} variant="outlined" size="small" color='success' startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmUpdate(items, item.id, item.employee_id, item.row_index, item.status)}>Approve</Button>
                                                                                    )}
                                                                                    {/* <Typography sx={{ color: '#5c5c5c' }}>table update</Typography> */}
                                                                                </Box>
                                                                            ) : null}
                                                                            <Box key={index} sx={{ flex: 1 }}>
                                                                                {item.table_field === 'rowId' || item.table_field === 'ext' || item.table_field === 'order' ? null : item.table_field === 'file_path' ? (
                                                                                    <>
                                                                                        {item.new_value ? (
                                                                                            <>
                                                                                                <Typography sx={{ textAlign: 'center', color: 'warning.main' }}>file</Typography>
                                                                                                <Tooltip title="view attached file">
                                                                                                    <Button variant="outlined" size="small" onClick={() => handleViewFile(item.id, 'trainings/viewAddedAttachFile')}>view file</Button>
                                                                                                </Tooltip>
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Typography sx={{ textAlign: 'center', color: 'warning.main' }}>file</Typography>
                                                                                                <Typography sx={{ textAlign: 'center', color: '#5c5c5c' }}> no attached file</Typography>
                                                                                            </>
                                                                                        )}

                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Typography sx={{ textAlign: 'center', color: 'warning.main', fontSize: '.8rem' }}>{item.table_field === 'RefName' ? "NAME" : item.table_field === 'RefAddress' ? 'ADDRESS' : item.table_field === 'RefTel' ? 'TEL NO.' : ''}</Typography>
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
                                                            NAME
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            ADDRESS
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            TEL NO.
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {toDelete.map((item, index) => (
                                                        <TableRow key={index} sx={{ mt: 1 }}>
                                                            <TableCell>
                                                                {!props.pdsParam.id && localStorage.getItem('hris_roles') !== '1' && props.referencesUpdates.length > 0 ? (
                                                                    <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => removeDeleted(item.employee_id, item.id, item.status)}>remove</Button>
                                                                ) : (
                                                                    <Button sx={{ mt: 1 }} variant="outlined" size="small" color='success' startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmDeleted(item.employee_id, item.id, item.status)}>Approve</Button>
                                                                )}
                                                                {/* <Button sx={{ mt: 1 }} variant="contained" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmDeleted(item.employee_id, item.id, item.status)}>confirm</Button> */}
                                                            </TableCell>
                                                            <TableCell align='left'>
                                                                {item.RefName}
                                                            </TableCell>
                                                            <TableCell align='left'>
                                                                {item.RefAddress}
                                                            </TableCell>
                                                            <TableCell align='left'>
                                                                {item.RefTel}
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