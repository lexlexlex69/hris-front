import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import { blue, green, orange, red } from '@mui/material/colors';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Pagination from '@mui/material/Pagination';

import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import InfoIcon from '@mui/icons-material/Info';

import { getPublicatedJobs } from './Controller';
import Skeleton from '@mui/material/Skeleton'
import { Fade, Tooltip } from '@mui/material';
import moment from 'moment'

import DetailsModal from './tablePositionComponents/DetailsModal';
import ApplyPosition from './tablePositionComponents/ApplyPosition';
import Swal from 'sweetalert2';

import CommonModal from '../../../../common/Modal'
import CommonDialog from '../../../../common/CommonDialog'

const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const TablePositions = () => {

    // details modal
    const [open, setOpen] = useState(false);
    const [modalState, setModalState] = useState('')
    const handleOpen = (item) => {
        setModalState(item)
        setOpen(true)
    };
    const handleClose = () => setOpen(false);
    // 
    // dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogState, setDialogState] = useState(false);

    const handleClickOpenDialog = (item) => {
        Swal.fire({
            text: "Continue applying for this vacant position?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
        }).then((result) => {
            if (result.isConfirmed) {
                setDialogState(item)
                setOpenDialog(true);
            }
        })
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    // pagination
    const perPage = 2
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    // 
    const [pos, setPos] = useState([])
    const [loader, setLoader] = useState(true)
    const [filters, setFilters] = useState({
        posStatus: 'RE',
        posName: '',
    })

    const handlePaginate = (e, v) => {
        console.log()
        if (page === v)
            return
        else {
            getPublicatedJobs(setPos, setLoader, filters, v, perPage, setTotal)
            setPage(v)
        }
    }
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSearchPosition = () => {
        getPublicatedJobs(setPos, setLoader, filters, page, perPage, setTotal)
    }

    useEffect(() => {
        // getPublicatedJobs(setPos, setLoader, filters, page, perPage, setTotal)
    }, [])


    return (
        <div>
            {/* modal details */}
            <CommonModal open={open} handleClose={handleClose} setOpen={setOpen} customWidth='60%' >
                <DetailsModal data={modalState} />
            </CommonModal>
            {/* apply dialog */}
            <CommonDialog open={openDialog} handleClose={handleCloseDialog} title={`Applying for: ${dialogState?.position_name}`} customWidth='90%'>
                <ApplyPosition data={dialogState} handleClose={handleCloseDialog} pos={pos} setPos={setPos} />
            </CommonDialog>
            <Typography variant="body1" sx={{ bgcolor: 'primary.dark', p: 1, color: '#fff' }}>JOB VACANCY</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Box display="" mx="" my="" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, width: '50%', alignItems: 'center' }}>
                    <TextField
                        label="search position"
                        id="outlined-start-adornment"
                        size='small'
                        select
                        sx={{ flex: 1 }}
                        name="posStatus"
                        value={filters.posStatus}
                        onChange={handleFilterChange}
                    >
                        <MenuItem value='RE'>Permanent</MenuItem>
                        <MenuItem value='CS' >Casual</MenuItem>
                        <MenuItem value="JO" >Jo</MenuItem>
                        <MenuItem value='COS' >Cos</MenuItem>
                    </TextField>
                    <TextField
                        label="search position"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch', flex: 1 }}
                        name="posName"
                        value={filters.posName}
                        onChange={handleFilterChange}
                        size='small'
                    />
                    <Box>
                        <Tooltip title="Search">
                            <SearchIcon color='primary' sx={{ fontSize: 35, cursor: 'pointer', mr: 2 }} onClick={handleSearchPosition} />
                        </Tooltip>
                    </Box>

                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ mt: 1 }} aria-label="position table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">POSITION TITLE</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">PLANTILLA ITEM NO. / MPR number</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">PLACE OF ASSIGNMENT</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">STATUS OF APPOINTMENT</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">POSTING DATE</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">CLOSING DATE</TableCell>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }} colSpan={2} align="right">ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, i) => (
                                    <TableRow key={i} >
                                        {Array.from(Array(7)).map((x, i2) => (
                                            <TableCell key={i2} sx={{ color: '#fff' }} align="left"><Skeleton variant="text" width="" height={30} animation="pulse" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {pos && pos.map((item, i) => (
                                    <Fade in key={i}>
                                        <TableRow  >
                                            <TableCell align="left">{item?.position_name}</TableCell>
                                            <TableCell align="left">{item?.plantilla_id ? item?.plantilla_item : item?.mpr_no}</TableCell>
                                            <TableCell align="left">{item?.dept_title}</TableCell>
                                            <TableCell align="left">{item?.emp_status === 'RE' ? 'PERMANENT' : item?.emp_status === 'CS' ? 'CASUAL' : item?.emp_status === 'JO' ? 'JOB ORDER' : item?.emp_status === 'COS' ? 'CONTRACT OF SERVICE' : ''}</TableCell>
                                            <TableCell align="left">{moment(item?.posting_date, "YYYY-MM-DD").format("MM/DD/YYYY")}</TableCell>
                                            <TableCell align="left">{moment(item?.closing_date, "YYYY-MM-DD").format("MM/DD/YYYY")} </TableCell>
                                            <TableCell align="right">
                                                <Box display='flex' gap={2}>
                                                    <Tooltip title="View details">
                                                        <InfoIcon sx={{ cursor: 'pointer', transition: 'all .3s', color: '#fff', fontSize: 40, border: `2px solid ${blue[500]}`, '&:hover': { borderColor: `${blue[800]}`, bgcolor: `${blue[800]}` }, p: .5, px: 1, borderRadius: '20%', bgcolor: `${blue[500]}` }} onClick={() => handleOpen(item)} />
                                                    </Tooltip>
                                                    <Tooltip title="Apply position">
                                                        <WorkOutlineIcon sx={{ cursor: 'pointer', transition: 'all .3s', color: '#fff', fontSize: 40, border: Math.ceil(moment.duration(moment(new Date(), 'YYYY-MM-DD').diff(moment(item?.closing_date, 'YYYY-MM-DD'))).asDays()) > 0 ? `2px solid ${orange[500]}` : `2px solid ${green[500]}`, '&:hover': { border: Math.ceil(moment.duration(moment(new Date(), 'YYYY-MM-DD').diff(moment(item?.closing_date, 'YYYY-MM-DD'))).asDays()) > 0 ? `2px solid ${orange[800]}` : `2px solid ${green[800]}` }, '&:hover': { bgcolor: Math.ceil(moment.duration(moment(new Date(), 'YYYY-MM-DD').diff(moment(item?.closing_date, 'YYYY-MM-DD'))).asDays()) > 0 ? `${orange[800]}` : `${green[800]}` }, p: .5, px: 1, borderRadius: '20%', bgcolor: Math.ceil(moment.duration(moment(new Date(), 'YYYY-MM-DD').diff(moment(item?.closing_date, 'YYYY-MM-DD'))).asDays()) > 0 ? 'warning.main' : 'success.main', '&:hover': { bgcolor: Math.ceil(moment.duration(moment(new Date(), 'YYYY-MM-DD').diff(moment(item?.closing_date, 'YYYY-MM-DD'))).asDays()) > 0 ? 'warning.dark' : 'success.dark' } }} onClick={() => handleClickOpenDialog(item)} />
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {!loader && pos && pos.length === 0 && <Typography variant="body1" sx={{ bgcolor: red[300], px: 1, my: .5, color: '#fff', borderRadius: '.2rem', width: '100%' }} align='center'>no record</Typography>}
            </Box>
            <Pagination count={Math.ceil(total / perPage)} size='small' page={page} sx={{ mt: 1 }} onChange={handlePaginate} />
        </div>
    );
};

export default TablePositions;