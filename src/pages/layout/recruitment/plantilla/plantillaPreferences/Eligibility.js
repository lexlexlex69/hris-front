import React, { useState, useEffect } from 'react'
import { red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import CustomReactSelect from './CustomReactSelect';
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'

function Eligibility({ id: positionId }) {
    const [items, setItems] = useState([])
    const [isRequired, setIsRequired] = useState(true)
    const [loader, setLoader] = useState(true)
    const [isRequiredLoader, setIsRequiredLoader] = useState(false)
    const [isRequiredDisabler, setIsRequiredDisabler] = useState(false)
    const [forceFetchItems, setForceFetchItems] = useState(true)

    const handleRequire = async () => {
        setIsRequiredLoader(true)
        try {
            let require = await axios.post(`/api/recruitment/toggleRequiredPointSystem`, { positionId: positionId, category: 'eligibility', isRequired: isRequired })
            if (require.data.status === 200) {
                setIsRequiredLoader(false)
                setIsRequired(prev => !prev)
                toast.success('Status changed!')
                setItems([])
            }
            else {
                setIsRequiredLoader(false)
                toast.error(require.data.status)
            }
        }
        catch (err) {
            setIsRequiredLoader(false)
            toast.error(err.message)
        }

    }

    const handleDeleteItem = (param) => {
        Swal.fire({
            text: "Delete this item?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            Swal.fire({
                text: 'processing request . . .',
                icon: 'info'
            })
            Swal.showLoading()
            if (result.isConfirmed) {
                axios.post(`/api/recruitment/deletePointSystemEntry`, { id: param.id })
                    .then(res => {
                        Swal.close()
                        toast.success('updated')
                        if (res.data.status === 200) {
                            let deleted_items = items.filter(item => item.id !== param.id)
                            setItems(deleted_items)
                        }
                    })
                    .catch(err => {
                        toast.error(err.message)
                        Swal.close()
                    })
            }
        })
    }

    const handleUpdate = async (item) => {
        if (!item.value) {
            toast.warning('Nothing to update!')
            return
        }
        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let update = await axios.post(`/api/recruitment/updateEntriesForPointSystem`, { item, category: 'eligibility' })
        Swal.close()
        if (update.data.status === 200) {
            toast.success('updated')
        }
    }

    const handleChangePoints = (x, value) => {
        let newItems = items.map(item => item.id === x.id ? { ...item, value: value } : item)
        setItems(newItems)
    }

    const fetchFromApi = async (controller) => {
        setLoader(true)
        try {
            let pointSystemData = await axios.post(`/api/recruitment/collectPointSystemPerCategory`, {
                category: 'eligibility',
                plantilla_id: positionId,
            }, { signal: controller.signal })
            setLoader(false)
            if (pointSystemData.data.status === 200) {
                if (pointSystemData.data.point_system_items.length === 0) {
                    setIsRequiredDisabler(true)
                }
                else {
                    setIsRequiredDisabler(false)
                }
                setItems(pointSystemData.data.point_system_items)
            }
        }
        catch (err) {
            setLoader(false)
            if (err.message === 'canceled')
                return
            else
                toast.error(err.message)
        }
    }

    useEffect(() => {
        let controller = new AbortController();
        fetchFromApi(controller)
        return () => controller.abort()
    }, [forceFetchItems])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <FormGroup>
                    <FormControlLabel control={<Switch disabled={isRequiredDisabler} checked={isRequired} />} onChange={handleRequire} label={isRequiredLoader ? (<CircularProgress />) : isRequired ? "Required" : "Not Required"} />
                </FormGroup>
            </Box>
            <Box sx={{ position: 'relative', pointerEvents: isRequired ? null : 'none' }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <CustomReactSelect apiAddress='recruitment/AutoCompletePointsystem' label='elig_title' value='id' category='eligibility' positionId={positionId} isRequired={isRequired} setForceFetchItems={setForceFetchItems} setIsRequiredDisabler={setIsRequiredDisabler} />
                </Box>
                <Box>
                    <TableContainer component={Paper} style={{ maxHeight: '25.5rem' }}>
                        <Table aria-label="trainings table table" size='small' stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={isRequired ? 'cgb-color-table' : null} sx={{ color: '#fff', transition: 'all .3s', bgcolor: isRequired ? null : '#BEBEBE' }} align="left">Title</TableCell>
                                    <TableCell className={isRequired ? 'cgb-color-table' : null} sx={{ color: '#fff', transition: 'all .3s', bgcolor: isRequired ? null : '#BEBEBE' }} align="left">Points</TableCell>
                                    <TableCell className={isRequired ? 'cgb-color-table' : null} sx={{ color: '#fff', transition: 'all .3s', bgcolor: isRequired ? null : '#BEBEBE' }} align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loader ? (
                                    <>
                                        {Array.from(Array(5)).map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="left"><Skeleton height={25} variant="text" width="100%" /></TableCell>
                                                <TableCell align="left">
                                                    <Skeleton variant="text" width="100%" />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Skeleton variant="text" width="100%" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {items && items.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="left">{item.description}</TableCell>
                                                <TableCell align="left">
                                                    <Box display='flex'>
                                                    <Paper
                                                        component="form"
                                                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}
                                                    >
                                                        <InputBase
                                                            sx={{ ml: 1, flex: 1 }}
                                                            placeholder="input points"
                                                            inputProps={{ 'aria-label': 'search google maps' }}
                                                            value={item.value}
                                                            type='number'
                                                            onChange={(e) => handleChangePoints(item, e.target.value)}
                                                        />
                                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                                        <Tooltip title="update points value" placement='top'>
                                                            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={() => handleUpdate(item)}>
                                                                <EditIcon color='warning' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Paper>
                                                    </Box>
                                                 
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Delete item ?">
                                                        <DeleteIcon sx={{ color: isRequired ? red[500] : '#BEBEBE', cursor: 'pointer', '&:hover': { color: red[800] } }} onClick={() => handleDeleteItem(item)} />
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {!loader && items.length === 0 && <Typography variant='body1' color="error" sx={{ p: 1 }}>Data is empty.</Typography>}

                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(Eligibility)