import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Grid, Box, Card, CardContent, Typography, TextField, Fade, Button } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment'
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import MailIcon from '@mui/icons-material/Mail';
import Modal from '@mui/material/Modal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import ContactPageIcon from '@mui/icons-material/ContactPage';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Swal from 'sweetalert2'

function NotifModal({ data }) {
    const navigate = useNavigate()
    const [tableData, setTableData] = useState([])
    const [page, setPage] = React.useState(1);
    const [openBackdrop,setOpenBackdrop] = useState(true)

    // functions
    const handleChange = (event, value) => {
        let newValue = (value - 1) * 10
        let newLimit = value * 10
        let newArr = data.slice(newValue, newLimit)
        setPage(value);
        setTableData(newArr)
    };

    const handleNavigate = (id) => {
        Swal.fire({
            text:'redirecting, please wait . . .',
            icon:'info'
        })
        Swal.showLoading()

        setTimeout(() => {
            navigate(`view-pds/${id}`)
            Swal.close()
        },500)
    }

    useEffect(() => {
        let newArr = data.slice(0, 10)
        setTableData(newArr)
    }, [])
    return (
        <Box sx={{ mt: 1, mb: 3 }}>
            {/* <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop> */}
            <TableContainer component={Paper} sx={{ height: '31rem', maxHeigth: '31rem' }}>
                <Table aria-label="simple table" size="small" stickyHeader>
                    <TableHead sx={{ zIndex: 999 }}>
                        <TableRow>
                            <TableCell className="cgb-color-table"></TableCell>
                            <TableCell className="cgb-color-table" align="center" sx={{ color: '#fff' }}>Employee name</TableCell>
                            <TableCell className="cgb-color-table" align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData && tableData.map((item, index) => (
                            <Fade in key={index}>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell align="left">{index + 1}</TableCell>
                                    <TableCell align="center" sx={{ color: 'warning.main' }}>{item.fname} {item.mname} {item.lname}</TableCell>
                                    <Tooltip title="view employee pds">
                                        <TableCell align="right"><Button size="small" variant="contained" startIcon={<VisibilityIcon />} onClick={() => handleNavigate(item.id)}>view pds</Button></TableCell>
                                    </Tooltip>
                                </TableRow>
                            </Fade>
                        ))}
                    </TableBody>
                </Table>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Pagination count={Math.ceil(data.length / 10)} page={page} onChange={handleChange} sx={{ position: 'absolute', bottom: 15, left: 15 }} />
                </Stack>
            </TableContainer>

        </Box>
    )
}

export default NotifModal