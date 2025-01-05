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
import Paper from '@mui/material/Paper';
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

// toast
import { toast } from 'react-toastify'

import axios from 'axios'

function TableUpdates({ childrenwithUpdates, setChildrenwithUpdates }) {
    //console.log('rerender table update children')

    const [added, setAdded] = useState([])
    const [updated, setUpdated] = useState([])
    const [deleted, setDeleted] = useState([])
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [addedLoader, setAddedLoader] = useState('')
    const [updateLoader, setUpdateLoader] = useState('')
    const [deletedLoader, setDeletedLoader] = useState('')
    // functions

    const handleConfirmAdded = (item, action, index) => {
        //console.log(index)
        let data = {
            table_name: item.child.table_name,
            item: item
        }
        if (action === 'add') {
            data.category = 'add'
            setAddedLoader(index)
            axios.post(`/api/pds/confirmChildrenAdd`, data)
                .then(res => {
                    //console.log(res)
                    if (res.data.status === 200) {
                        let newChildrenwithUpdates = childrenwithUpdates.filter(items => items.row_index != item.child.row_index)
                        setChildrenwithUpdates(newChildrenwithUpdates)
                        setAddedLoader('')
                        toast.success('Field Confirmed!')
                    }
                })
                .catch(err => {
                    setAddedLoader('')
                    //console.log(err)
                })
        }
        else if (action === 'update') {
            data.category = 'update'
            setUpdateLoader(index)
            axios.post(`/api/pds/confirmChildrenUpdate`, data)
                .then(res => {
                    //console.log(res)
                    if (res.data.status === 200) {
                        let newChildrenwithUpdates = childrenwithUpdates.filter(items => items.row_index != item.child.row_index)
                        setChildrenwithUpdates(newChildrenwithUpdates)
                        setUpdateLoader('')
                        toast.success('Field Confirmed!')
                    }
                })
                .catch(err => {
                    setUpdateLoader('')
                    //console.log(err)
                })
        }
        else if (action === 'delete') {
            data.category = 'delete'
            setDeletedLoader(index)
            axios.post(`/api/pds/confirmChildrenDelete`, data)
                .then(res => {
                    //console.log(res)
                    if (res.data.status === 200) {
                        let newChildrenwithUpdates = childrenwithUpdates.filter(items => items.row_index != item.child.row_index)
                        setChildrenwithUpdates(newChildrenwithUpdates)
                        setDeletedLoader('')
                        toast.success('Field Confirmed!')
                    }
                })
                .catch(err => {
                    setDeletedLoader('')
                    //console.log(err)
                })
        }
    }


    useEffect(() => {
        //console.log(childrenwithUpdates)
        let addedArray = []
        let updatedArray = []
        let removedArray = []
        let childnameAdded = childrenwithUpdates.filter(item => item.status === 2 && item.table_field === 'child_name')
        let dobAdded = childrenwithUpdates.filter(item => item.status === 2 && item.table_field === 'dob')
        let childnameUpdated = childrenwithUpdates.filter(item => item.status === 0 && item.table_field === 'child_name')
        let dobUpdated = childrenwithUpdates.filter(item => item.status === 0 && item.table_field === 'dob')
        let childnameRemoved = childrenwithUpdates.filter(item => item.status === 3 && item.table_field === 'child_name')
        let dobRemoved = childrenwithUpdates.filter(item => item.status === 3 && item.table_field === 'dob')

        for (let i = 0; i < childnameAdded.length; i++) { // get all the added children information and push to the addedArray variable
            addedArray.push({
                child: childnameAdded[i],
                dob: dobAdded[i]
            })
        }
        for (let i = 0; i < childnameUpdated.length; i++) { // get all the updated children information and push to the updatedArray variable
            updatedArray.push({
                child: childnameUpdated[i],
                dob: dobUpdated[i]
            })
        }
        for (let i = 0; i < childnameRemoved.length; i++) { // get all the removed children information and push to the removedArray variable
            removedArray.push({
                child: childnameRemoved[i],
                dob: dobRemoved[i]
            })
        }
        setAdded(addedArray)
        setUpdated(updatedArray)
        setDeleted(removedArray)
    }, [childrenwithUpdates])

    return (
        <Grid container spacing={0} >
            <TableContainer sx={{ maxHeight: '78vh' }}>
                <Table size="small" aria-label="confirm updates table" stickyHeader>
                    <TableHead >
                        <TableRow>
                            <TableCell width="30%" align="center" >
                                <Box sx={{ display: 'flex' }}>
                                    <AddIcon sx={{color:'success.main'}} />&nbsp;
                                    <Typography sx={{color:'success.main'}} >
                                        Added children
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell width="30%" align="center">
                                <Box sx={{ display: 'flex' }}>
                                    <EditIcon sx={{color:'warning.main'}} />&nbsp;
                                    <Typography sx={{color:'warning.main'}} >
                                        Updated children
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell width="30%" align="center">
                                <Box sx={{ display: 'flex' }}>
                                    <DeleteIcon sx={{color:'error.main'}} />&nbsp;
                                    <Typography sx={{color:'error.main'}} >
                                        Deleted children
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, width: '100%' }}
                        >
                            <TableCell component="th" scope="row">
                                <Table>
                                    <TableBody sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: 1 }}>
                                        {added && added.map((item, index) => (
                                            <TableRow key={index}>
                                                <Card raised sx={{ p: 1 }}>
                                                    <Typography className='faded-grey' sx={{ textAlign: 'right' }}>{index + 1}</Typography>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                                                        <TextField fullWidth variant='filled' color="success" value={item.child.new_value} label="Name" focused />
                                                        <TextField fullWidth variant='filled' color="success" value={item.dob.new_value} label="Dob" focused />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <LoadingButton
                                                            loading={index === addedLoader ? true : false}
                                                            loadingPosition="start"
                                                            onClick={() => handleConfirmAdded(item, 'add', index)}
                                                            startIcon={<CheckIcon />}
                                                            variant="outlined"
                                                        >
                                                            {addedLoader !== '' && index === addedLoader ? 'Please wait' : 'Confirm'}
                                                        </LoadingButton>
                                                        <Button variant='outlined' color="error">decline</Button>
                                                    </Box>
                                                </Card>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Table>
                                    <TableBody sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: 1, height: '100%' }}>
                                        {updated && updated.map((item, index) => (
                                            <TableRow>
                                                <Card raised sx={{ p: 1 }}>
                                                    <Typography className='faded-grey' sx={{ textAlign: 'right' }}>{index + 1}</Typography>
                                                    <Box sx={{ p: .5 }}>
                                                        <Typography sx={{ color: '#999793' }}>OLD NAME: {item.child.old_value}</Typography>
                                                        <Typography sx={{ color: '#999793' }}>OLD DOB: {item.dob.old_value}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                                                        <TextField fullWidth variant='filled' color="warning" value={item.child.new_value} label="Name" focused />
                                                        <TextField fullWidth variant='filled' color="warning" value={item.dob.new_value} label="Dob" focused />
                                                    </Box>
                                                    {/* <Typography sx={{ color: yellow[800] }}>Name: {item.child.new_value}</Typography>
                                                    <Typography sx={{ color: yellow[800] }}>Dob: {item.dob.new_value}</Typography> */}
                                                    <hr />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <LoadingButton
                                                            loading={index === updateLoader ? true : false}
                                                            loadingPosition="start"
                                                            onClick={() => handleConfirmAdded(item, 'update', index)}
                                                            startIcon={<CheckIcon />}
                                                            variant="outlined"
                                                        >
                                                            {updateLoader !== '' && index === updateLoader ? 'Please wait' : 'Confirm'}
                                                        </LoadingButton>
                                                        <Button variant='outlined' color="error">decline</Button>
                                                    </Box>
                                                </Card>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Table>
                                    <TableBody sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
                                        {deleted && deleted.map((item, index) => (
                                            <TableRow key={index}>
                                                <Card sx={{ p: 1 }} raised>
                                                    <Typography className='faded-grey' sx={{ textAlign: 'right' }}>{index + 1}</Typography>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                                                        <TextField fullWidth variant='filled' color="error" value={item.child.new_value} label="Name" focused />
                                                        <TextField fullWidth variant='filled' color="error" value={item.dob.new_value} label="Dob" focused />
                                                    </Box>
                                                    <hr />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <LoadingButton
                                                            loading={index === deletedLoader ? true : false}
                                                            loadingPosition="start"
                                                            onClick={() => handleConfirmAdded(item, 'delete', index)}
                                                            startIcon={<CheckIcon />}
                                                            variant="outlined"
                                                        >
                                                            {deletedLoader !== '' && index === deletedLoader ? 'Please wait' : 'Confirm'}
                                                        </LoadingButton>
                                                        <Button variant='outlined' color="error">decline</Button>
                                                    </Box>
                                                </Card>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

TableUpdates.propTypes = {
    childrenwithUpdates: PropTypes.array
}

export default TableUpdates