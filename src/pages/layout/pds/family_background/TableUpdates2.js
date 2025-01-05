import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { blue, yellow, red, green } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// icons
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

// toast
import { toast } from 'react-toastify'
import axios from 'axios'

// external function
import { handleViewFile, handleViewAddedFile } from '../customFunctions/CustomFunctions'

function TableUpdates2(props) {

    const [toAdd, setToAdd] = useState({})
    const [toUpdate, setToUpdate] = useState({})
    const [toUpdate2, setToUpdate2] = useState(props.children)
    const [toDelete, setToDelete] = useState([])
    const [toDeleteTemp2, setToDeleteTemp2] = useState(props.children)
    const [choice, setChoice] = useState('')

    const handleConfirmAdded = async (objId, table_name, employee_id, row_index, status) => {
        const id = toast.loading("Processing request...")
        axios.post(`/api/pds/family/confirmChildrenAdd`, {
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
                    let filteredUpdates = props.childrenwithUpdates.filter(item => item.row_index !== row_index)
                    props.setChildrenwithUpdates(filteredUpdates)
                }
            })
            .catch(err => {
                toast.update(id, { render: err.message, type: "error", isLoading: false, autoClose: 2000, });
            })
    }

    const handleConfirmUpdate = (id, data_id, employee_id, row_index, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/family/confirmChildrenUpdate`, {
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
                    let filteredUpdates = props.childrenwithUpdates.filter(item => item.row_index !== row_index)
                    props.setChildrenwithUpdates(filteredUpdates)
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 2000, });
                console.log(err)
            })

    }

    const handleConfirmDeleted = (employee_id, id, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/family/confirmChildrenDelete`, {
            employee_id: employee_id,
            id: id,
            status: '3'
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newDeletedArr = toDelete.filter(item => item.id !== id)
                    setToDelete(newDeletedArr)
                    let filteredUpdates = props.childrenwithUpdates.filter(item => Number(item.row_index) !== id)
                    props.setChildrenwithUpdates(filteredUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: "Something went wrong!", type: "error", isLoading: false, autoClose: 2000, });

                }
            })
            .catch(err => {
                toast.update(toastId, { render: "Something went wrong!", type: "error", isLoading: false, autoClose: 2000, });
                console.log(err)
            })
    }

    // removing entries
    const handleRemoveAdded = async (objId, table_name, employee_id, row_index, status) => {
        const id = toast.loading("Processing request...")
        axios.post(`/api/pds/family/removeChildrenAdd`, {
            table_name: table_name,
            employee_id: employee_id,
            row_index: row_index,
            status: status,
            data_id: objId
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(id, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newObj = {}
                    Object.assign(newObj, toAdd)
                    delete newObj[objId]
                    setToAdd(newObj)
                    let filteredUpdates = props.childrenwithUpdates.filter(item => item.row_index !== row_index)
                    props.setChildrenwithUpdates(filteredUpdates)
                }
                if (res.data.status === 204) {
                    toast.update(id, { render: res.data.message + ', refresh the table', type: "warning", isLoading: false, autoClose: 2000, });
                }
            })
            .catch(err => {
                toast.update(id, { render: err.message, type: "error", isLoading: false, autoClose: 2000, });
            })
    }

    const handleRemoveUpdate = (id, data_id, employee_id, row_index, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/family/removeChildrenUpdate`, {
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
                    let filteredUpdates = props.childrenwithUpdates.filter(item => item.row_index !== row_index)
                    setToUpdate(newObj)
                    props.setChildrenwithUpdates(filteredUpdates)
                }
                if (res.data.status === 204) {
                    toast.update(id, { render: res.data.message + ', refresh the table', type: "warning", isLoading: false, autoClose: 2000, });
                }
            })
            .catch(err => {
                toast.update(toastId, { render: err.message, type: "success", isLoading: false, autoClose: 2000, });
                console.log(err)
            })

    }

    const handleRemoveDeleted = (employee_id, id, status) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/family/removeChildrenDelete`, {
            employee_id: employee_id,
            id: id,
            status: '3'
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newDeletedArr = toDelete.filter(item => item.id !== id)
                    setToDelete(newDeletedArr)
                    let filteredUpdates = props.childrenwithUpdates.filter(item => Number(item.row_index) !== id)
                    props.setChildrenwithUpdates(filteredUpdates)
                }
                else if (res.data.status === 500) {
                    toast.update(toastId, { render: "Something went wrong!", type: "error", isLoading: false, autoClose: 2000, });

                }
            })
            .catch(err => {
                toast.update(toastId, { render: "Something went wrong!", type: "error", isLoading: false, autoClose: 2000, });
                console.log(err)
            })
    }
    useEffect(() => {
        let toAddTemp = props.childrenwithUpdates.filter(item => item.status === 2)
        let toUpdateTemp = props.childrenwithUpdates.filter(item => item.status === 0)
        let toDeleteTemp = props.childrenwithUpdates.filter(item => item.status === 3)
        function groupBy(array, property) {
            var hash = {};
            for (var i = 0; i < array.length; i++) {
                if (!hash[array[i][property]]) hash[array[i][property]] = [];
                hash[array[i][property]].push(array[i]);
            }
            return hash;
        }
        setToAdd(groupBy(toAddTemp, 'row_index'))
        setToUpdate(groupBy(toUpdateTemp, 'row_index'))
        console.log(toDeleteTemp)
        let newToDeleteTemp = [] // code below to store to delete states and temporary delete state
        toDeleteTemp.map((item) => {
            toDeleteTemp2.map((items) => {
                if (Number(item.row_index) === items.id) {
                    newToDeleteTemp.push(items)
                }
            })
            setToDelete(newToDeleteTemp)
        })
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
                                <TableContainer component={Paper} sx={{maxHeight:'75vh'}}>
                                    <Table aria-label="simple table" size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}></TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>NAME OF CHILD</TableCell>
                                                <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>DATE OF BIRTH</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.keys(toAdd).map((items, index) => (
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} size="small">
                                                    {toAdd[items].map((item, index) => (
                                                        <React.Fragment key={index}>
                                                            {index === 0 ? (
                                                                <TableCell component="th" scope="row" align="left">
                                                                    {localStorage.getItem('hris_roles') !== '1' && !props.pdsParam.id ? (
                                                                        <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => handleRemoveAdded(items, item.table_name, item.employee_id, item.row_index, item.status)}>remove</Button>
                                                                    ) :
                                                                        (
                                                                            <Button sx={{ mt: 1 }} variant="outlined" color="success" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmAdded(items, item.table_name, item.employee_id, item.row_index, item.status)}>approve</Button>
                                                                        )}
                                                                </TableCell>
                                                            ) : null}

                                                            {item.table_field === 'rowId' || item.table_field === 'ext' || item.table_field === 'order' ? null : item.table_field === 'file_path' ? (
                                                                <TableCell component="th" scope="row" align="left">
                                                                    <>
                                                                        {item.new_value ? (
                                                                            <>
                                                                                <Tooltip title="view attached file">
                                                                                    <Button variant="outlined" size="small" onClick={() => handleViewFile(item.id, 'education/viewAddedAttachFile')}>view file</Button>
                                                                                </Tooltip>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Typography sx={{ textAlign: 'center', color: '#5c5c5c' }}> no attached file</Typography>
                                                                            </>
                                                                        )}

                                                                    </>
                                                                </TableCell>
                                                            ) : (
                                                                <>
                                                                    <TableCell component="th" scope="row" align="left">
                                                                        <Typography sx={{ textAlign: 'left' }}>{item.new_value}</Typography>
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
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
                                    <TableContainer component={Paper} sx={{maxHeight:'75vh'}}>
                                        <Table aria-label="simple table" size="small" stickyHeader>
                                            <TableBody>
                                                {Object.keys(toUpdate).map((items, index) => (
                                                    <TableRow key={index} sx={{ display: 'flex', gap: 1 }}>
                                                        <TableCell width="100%" key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow size="small">
                                                                            <TableCell className="cgb-color-table">
                                                                                <Typography className="pds-update-text-color">
                                                                                    NAME OF CHILD
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell className="cgb-color-table" >
                                                                                <Typography className="pds-update-text-color">
                                                                                    DATE OF BIRTH
                                                                                </Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        <TableRow size="small">
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).child_name}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {toUpdate2 && toUpdate2.find(x => {
                                                                                    if (Number(x.id) === Number(items))
                                                                                        return x
                                                                                }).dob}
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
                                                                                    {/* <Typography sx={{ color: '#5c5c5c' }}>table update</Typography> */}
                                                                                    {
                                                                                        localStorage.getItem('hris_roles') !== '1' && !props.pdsParam.id ? (
                                                                                            <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => handleRemoveUpdate(items, item.id, item.employee_id, item.row_index, item.status)}>remove</Button>
                                                                                        ) :
                                                                                            (
                                                                                                <Button sx={{ mt: 1 }} variant="outlined" color="success" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmUpdate(items, item.id, item.employee_id, item.row_index, item.status)}>approve</Button>
                                                                                            )}
                                                                                </Box>
                                                                            ) : null}
                                                                            <Box key={index} sx={{ flex: 1 }}>
                                                                                {item.table_field === 'rowId' || item.table_field === 'ext' || item.table_field === 'order' ? null : item.table_field === 'file_path' ? (
                                                                                    <>
                                                                                        {item.new_value ? (
                                                                                            <>
                                                                                                <Typography sx={{ textAlign: 'center', color: 'warning.main' }}>file</Typography>
                                                                                                <Tooltip title="view attached file">
                                                                                                    {/* <AttachFileIcon sx={{ cursor: 'pointer' }} onClick={() => handleViewFile(item.id, 'education/viewAddedAttachFile')} /> */}
                                                                                                    <Button variant="outlined" size="small" onClick={() => handleViewAddedFile(item.id, 'education/viewAddedAttachFile')}>view file</Button>
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
                                                                                        <Typography sx={{ textAlign: 'center', color: 'warning.main', fontSize: '.7rem' }}>{item.table_field === 'child_name' ? 'CHILD NAME' : item.table_field === 'dob' ? 'DATE OF BIRTH' : ''}</Typography>
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
                                        <TableContainer component={Paper} sx={{maxHeight:'75vh'}}>
                                            <Table aria-label="simple table" size="small" stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            NAME OF CHILD
                                                        </TableCell>
                                                        <TableCell className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>
                                                            DATE OF BIRTH
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {toDelete.map((item, index) => (
                                                        <TableRow key={index} sx={{ mt: 1 }}>
                                                            <TableCell>
                                                                {
                                                                    localStorage.getItem('hris_roles') !== '1' && !props.pdsParam.id ? (
                                                                        <Button sx={{ mt: 1 }} variant="outlined" color="error" size="small" startIcon={<DoDisturbIcon />} onClick={() => handleRemoveDeleted(item.employee_id, item.id, item.status)}>remove</Button>
                                                                    ) :
                                                                        (
                                                                            <Button sx={{ mt: 1 }} variant="outlined" color="success" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirmDeleted(item.employee_id, item.id, item.status)}>approve</Button>
                                                                        )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography>{item.child_name}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.dob}
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

TableUpdates2.propType = {
    setChildrenWithUpdates: PropTypes.func.isRequired
}

export default React.memo(TableUpdates2)