import React, { useEffect, useState } from 'react'
import { blue, green, red, yellow, orange } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fab from '@mui/material/Fab';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';

import axios from 'axios';
import { toast } from 'react-toastify'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Updates({ updates, setUpdates, handleClose }) {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [toUpdate, setToUpdate] = useState({})

    const handleConfirm = (data, item) => {
        const toastId = toast.loading("Processing request...")
        axios.post(`/api/pds/others/otherItemsconfirmUpdates`, {
            data: data
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    toast.update(toastId, { render: "Changes confirmed!", type: "success", isLoading: false, autoClose: 2000, });
                    let newObj = {}
                    Object.assign(newObj, toUpdate)
                    delete newObj[item]
                    setToUpdate(newObj)
                    let tempFilterUpdates = updates
                    let filteredUpdates = []
                    data.map((item, index) => {
                        filteredUpdates = tempFilterUpdates.filter(items => items.id !== item.id)
                        tempFilterUpdates = filteredUpdates
                    })
                    setUpdates(tempFilterUpdates)
                    if (tempFilterUpdates.length === 0) {
                        handleClose()
                    }
                }
            })
            .catch(err => {
                console.log(err)
                toast.update(toastId, { render: 'Error', type: "error", isLoading: false, autoClose: 2000, });
            })

    }
    useEffect(() => {
        function groupBy(array, property) {
            var hash = {};
            for (var i = 0; i < array.length; i++) {
                if (!hash[array[i][property]]) hash[array[i][property]] = [];
                hash[array[i][property]].push(array[i]);
            }
            return hash;
        }
        console.log(groupBy(updates, 'row_index'))
        setToUpdate(groupBy(updates, 'row_index'))

    }, [])
    return (
        <>
            <Box sx={{ mt: 1, height: '95%', overflowY: 'scroll' }}>
                {/* {
                    Object.keys(toUpdate).map((item, index) => (
                        <React.Fragment key={index}>
                            <Card sx={{ p: .5, my: 1 }}>
                            <Typography sx={{ bgcolor: orange[800], color: '#fff', p: .5,px:1,borderRadius:'.2rem' }}>ITEM # : {item.split('_')[1]} [{item.split('_')[2].toUpperCase()}]</Typography>
                            <Box sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', gap: matches ? 1 : 0 }}>
                                {toUpdate[item].map((items, indexes) => (
                                    <Box key={indexes} sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', justifyContent: 'flex-start', width: '100%' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <Typography sx={{ textAlign: 'center', color: 'warning.main' }}>{items.table_field.toUpperCase()}</Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flex: 1 }}>
                                                <Typography sx={{ color: '' }}> <span style={{ color: 'red' }}>FROM:</span> {items.old_value === '1' ? 'YES' : items.old_value === '0' ? 'NO' : items.old_value}</Typography>
                                                <Typography> <span style={{ color: 'blue' }}>TO:</span> {items.new_value === '1' ? 'YES' : items.new_value === '0' ? 'NO' : items.new_value}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            <Button variant='outlined' size="small" color={"success"} startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirm(toUpdate[item], item)}>approve</Button>
                        </Card>
                            <Card sx={{ p: .5, my: 1 }}>
                                <Typography sx={{ bgcolor: orange[800], color: '#fff', p: .5, px: 1, borderRadius: '.2rem' }}>ITEM # : {item.split('_')[1]} [{item.split('_')[2].toUpperCase()}]</Typography>
                                <Box sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', gap: matches ? 1 : 0 }}>
                                    {toUpdate[item].map((items, indexes) => (
                                        <Box key={indexes} sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', justifyContent: 'flex-start', width: '100%' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <Typography sx={{ textAlign: 'center', color: 'warning.main' }}>{items.table_field.toUpperCase()}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flex: 1 }}>
                                                    <Typography sx={{ color: '' }}> <span style={{ color: 'red' }}>FROM:</span> {items.old_value === '1' ? 'YES' : items.old_value === '0' ? 'NO' : items.old_value}</Typography>
                                                    <Typography> <span style={{ color: 'blue' }}>TO:</span> {items.new_value === '1' ? 'YES' : items.new_value === '0' ? 'NO' : items.new_value}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Button variant='outlined' size="small" color={"success"} startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirm(toUpdate[item], item)}>approve</Button>
                            </Card>

                        </React.Fragment>
                    ))
                } */}
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" sx={{maxWidth:'50rem'}}>
                        <TableHead>
                        </TableHead>
                        <TableBody>
                            {Object.keys(toUpdate).map((item, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Button variant='outlined' size="small" color={"success"} startIcon={<CheckCircleOutlineIcon />} onClick={() => handleConfirm(toUpdate[item], item)}>approve</Button>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Typography sx={{ color: 'error.main' }}>
                                          <span style={{color:'#5c5c5c',fontWeight:'bold'}}> item:</span> {item.split('_')[1]} {item.split('_')[2].toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    {toUpdate[item].map((items, indexes) => (
                                        <React.Fragment>
                                        {items.table_field === 'specify2' && items.new_value === null ? null : (
                                            <TableCell component="th" scope="row">
                                                <Typography sx={{ color: 'primary.main' }}>
                                                    {items.table_field === 'specify2' && items.new_value !== null ? 'DATE FILED' : items.table_field.toUpperCase()}
                                                </Typography>
                                                <Typography sx={{ color: 'warning.main' }}>
                                                    {items.new_value === '1' ? 'YES' : items.new_value === '0' ? 'NO' : items.new_value}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button variant='contained' color="error" size="small" onClick={handleClose}>close</Button>
            </Box> */}
        </>

    )
}

export default Updates